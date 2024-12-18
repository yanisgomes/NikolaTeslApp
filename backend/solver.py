"""
solver.py

This module defines the classes and methods necessary for building an analytical electronic circuit solver.
The solver is designed to produce transfer functions using Sympy for equation manipulation and solving.

Classes:
    Component: Represents an electronic component in the circuit.
    Circuit: Represents the entire electronic circuit and provides methods to analyze and solve it.
TODO : le résultat renvoyé est faux
"""

import sympy
from collections import defaultdict
from abc import ABC, abstractmethod
import re
import requests
from dotenv import load_dotenv
import os
from scipy.signal import TransferFunction, bode, step, lti
import numpy as np
import logging

# Configure logging at the beginning of the file
logging.basicConfig(level=logging.ERROR)

load_dotenv()
api_key = os.getenv('OPENROUTER_API_KEY')


class Parser:
    """
    The parse_netlist static method parses a netlist string and returns a Circuit object with the components.
    """
    @staticmethod
    def parse_netlist(netlist, compute_numeric=True):
        try:
            logging.info("Starting to parse netlist.")
            circuit = Circuit()
            lines = netlist.strip().split('\n')
            value = None
            for line in lines:
                line = line.strip().upper()
                if not line or line.startswith('*') or line.startswith('.'):
                    continue  # Skip comments and directives
                tokens = line.split()
                if not tokens:
                    logging.warning(f"Empty tokens found in line: {line}")
                    continue

                component_type = tokens[0][0].upper()  # First letter indicates component type
                name = tokens[0]
                nodes = Parser.extract_node_tokens(tokens, component_type)
                
                if compute_numeric:
                    value_token = Parser.extract_value_token(component_type, tokens)
                    if value_token != 'SYMBOLIC': # Symbolic is used to indicate that the value is not known (input variable for instance)
                        value = Parser.parse_value(value_token)
                
                if component_type == 'R': # Resistor
                    component = Resistor(name, nodes, value)
                elif component_type == 'V': # Voltage source
                    component = VoltageSource(name, nodes, value)
                elif component_type == 'L': # Inductor
                    component = Inductor(name, nodes, value)
                elif component_type == 'C': # Capacitor
                    component = Capacitor(name, nodes, value)
                elif component_type == 'O': # Opamp
                    component = Opamp(name, nodes)
                else:
                    logging.error(f"Unknown component type '{component_type}' in line: {line}")
                
                circuit.addComponent(component)

                for node in nodes:
                    if node not in circuit.nodes:
                        circuit.nodes.append(node) # add new nodes the circuit.nodes list

            circuit.nodes.sort()
            logging.info("Finished parsing netlist.")
            return circuit
        except Exception as e:
            logging.error(f"Error parsing netlist: {e}")
            raise

    @staticmethod
    def parse_value(value_str):
        """
        Parses the value string, handling units, and returns a numerical value.
        """
        units = {
            'T': 1e12,
            'G': 1e9,
            'MEG': 1e6,
            'K': 1e3,
            'M': 1e-3,
            'MIL': 25.4e-6,
            'U': 1e-6,
            'N': 1e-9,
            'P': 1e-12,
            'F': 1e-15,
        }
        try:
            match = re.match(r"([0-9\.]+)([A-Za-z]*)", value_str)
            if match:
                value, unit = match.groups()
                value = float(value)
                unit = unit.upper()
                multiplier = units.get(unit, 1)
                return value * multiplier
            else:
                return float(value_str)
        except ValueError as e:
            logging.error(f"Error parsing value '{value_str}': {e}")
            raise

    @staticmethod
    def extract_value_token(component_type, tokens):
        """
        Extracts the voltage token from the tokens. The value token may be at different positions depending on the component
        """
        if component_type == 'V':
            if 'DC' in tokens:
                idx = tokens.index('DC')
                return tokens[idx + 1]
            elif 'AC' in tokens: # TODO numeric computation of AC is not handled
                logging.warning("AC voltage sources are not supported.")
                raise ValueError("AC voltage sources are not supported.")
            else:
                # Assume the value is in the third position
                return tokens[3]
        else:
            return tokens[3]
    
    @staticmethod
    def extract_node_tokens(tokens, component_type):
        """
        Extracts the node tokens from the tokens. Depending on the component, there may be more than two nodes
        """
        if component_type == 'O':
            return tokens[1:4]
        else :
            return tokens[1:3]

class Component:
    """
    Represents an electronic component in the circuit.

    Attributes:
        name (str): The name of the component (e.g., 'R1', 'C1').
        value (float): The value of the component (e.g., resistance, capacitance).
        nodes (list): The list of nodes this component is connected to.
    """
    def __init__(self, name, nodes, value=None):
        self.name = name  # Component name (e.g., 'R1', 'C1')
        self.nodes = nodes  # List of nodes this component is connected to
        self.value = value
        self.motherComponent = None  # Reference to the mother component (e.g., for linearized elements)
        self.isLinear = True
        self.isVirtual = False  # Boolean indicating if the component is virtual (e.g., for linearized elements)
        self.equation = None  # The Voltage-Current equation for the component
        self.needsAdditionalEquation = False
    
    def __str__(self):
        return f"{self.name}[{self.nodes}]"
    
    @abstractmethod
    def getEquation(self, nodeVoltages, unknownCurrents, knownParameters):
        """
        TODO Return the Voltage-Current equation for the component.
        """
        
    @abstractmethod
    def linearize(self): 
        """ 
        TODO Linearize the component to handle nonlinear elements.
        """

        # TODO: Add additional attributes and methods as needed

class Resistor(Component):
    """
    Represents a resistor component in the circuit.

    Attributes:
        name (str): The name of the resistor (e.g., 'R1').
        value (float): The resistance value in Ohms.
        nodes (list): The list of nodes this resistor is connected to.
    """
    def __init__(self, name, nodes, value=None):
        super().__init__(name, nodes, value)
    
    def getEquation(self, node, nodeVoltages, unknownCurrents, knownParameters):
        """
        TODO ce n'est pas une equation qu'on retourne ici, mais une expression : changer le nom de la méthode
        Return the Voltage-Current equation for the resistor.
        """
        other_node = self.nodes[0] if self.nodes[1] == node else self.nodes[1]
        return (nodeVoltages[node] - nodeVoltages[other_node]) / knownParameters[self.name]
    
class VoltageSource(Component):
    """
    Represents a voltage source component in the circuit.

    Attributes:
        name (str): The name of the voltage source (e.g., 'V1').
        value (float): The voltage value in Volts.
        nodes (list): The list of nodes this voltage source is connected to.
    """
    def __init__(self, name, nodes, value=None):
        super().__init__(name, nodes, value)
        self.needsAdditionalEquation = True # Indicates that an additional equation is needed for this component
    
    def getEquation(self, node, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the Voltage-Current equation for the voltage source.
        """
        return unknownCurrents[node]

    def getAdditionalEquation(self, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the additional equation for the voltage source.
        """
        return (sympy.Eq(nodeVoltages[self.nodes[0]] - nodeVoltages[self.nodes[1]], knownParameters[self.name]), f"valeur de la source de tension {self.name}")

class Inductor(Component):
    """
    Represents an inductor component in the circuit.

    Attributes:
        name (str): The name of the inductor (e.g., 'L1').
        nodes (list): The list of nodes this inductor is connected to.
    """
    def __init__(self, name, nodes, value=None):
        super().__init__(name, nodes, value)
    
    def getEquation(self, node, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the Voltage-Current equation for the inductor.
        """
        other_node = self.nodes[0] if self.nodes[1] == node else self.nodes[1]
        return (nodeVoltages[node] - nodeVoltages[other_node]) / (knownParameters[self.name]*knownParameters["p"])

class Capacitor(Component):
    """
    Represents a capacitor component in the circuit.

    Attributes:
        name (str): The name of the capacitor (e.g., 'C1').
        nodes (list): The list of nodes this capacitor is connected to.
    """
    def __init__(self, name, nodes, value=None):
        super().__init__(name, nodes, value)
    
    def getEquation(self, node, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the Voltage-Current equation for the capacitor.
        """
        other_node = self.nodes[0] if self.nodes[1] == node else self.nodes[1]
        return (nodeVoltages[node] - nodeVoltages[other_node]) * knownParameters["p"] * knownParameters[self.name]
    
class Wire(Component):
    """
    Represents a wire component in the circuit.

    Attributes:
        name (str): The name of the wire (e.g., 'wire1').
        nodes (list): The list of nodes this wire is connected to.
    """
    def __init__(self, name, nodes):
        super().__init__(name, nodes)
        self.needsAdditionalEquation = True

    def getEquation(self, node, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the Voltage-Current equation for the wire.
        """
        return 0

    def getAdditionalEquation(self, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the additional equation for the wire.
        """
        return (sympy.Eq(nodeVoltages[self.nodes[0]] - nodeVoltages[self.nodes[1]], 0), f"hypothèse {self.motherComponent.name} parfait : V+ = V-")
class Opamp(Component):
    """
    Represents an opamp component in the circuit.
    Nodes need to be connected in the following order: non-inverting input, inverting input,output.

    Attributes:
        name (str): The name of the opamp (e.g., 'opamp1').
        nodes (list): The list of nodes this opamp is connected to.
    """
    def __init__(self, name, nodes):
        super().__init__(name, nodes)
        self.isLinear = False

    def getLinearizedVersion(self):
        """
        TODO Linearize the opamp to handle nonlinear elements.
        """
        wire = Wire(f'{self.name}_wire', [self.nodes[0], self.nodes[1]])
        wire.motherComponent = self # Reference to the mother component
        wire.isVirtual = True # Indicates that the component is virtual (not in the original netlist)
        voltageSource = VoltageSource(f'{self.name}_voltage', [self.nodes[2],'0'])
        voltageSource.motherComponent = self
        voltageSource.isVirtual = True
        voltageSource.needsAdditionalEquation = False # Do not need the usual additional equation for voltage sources : this voltage source is of unkonwn value
        return [wire, voltageSource]

        
    
class Circuit:
    """
    Represents the entire electronic circuit and provides methods to analyze and solve it.

    Attributes:
        components (list): List of Component instances in the circuit.
        nodes (list): List of all nodes in the circuit.
        connections (defaultdict): Dictionary mapping nodes to components.
        isConnexionListBuilt (bool): Indicates if the connection list is built.
        isEqSysEstablished (bool): Indicates if the equation system is established.
        equations (list): List of Sympy Equation objects representing the circuit equations.
    """
    def __init__(self):
        self.components = []  # List of Component instances
        self.nodes = []  # List of all nodes in the circuit
        self.connections = defaultdict(list)  # Dictionary mapping nodes to components
        self.isConnexionListBuilt = False  # Boolean indicating if the connection list is built
        self.isEqSysEstablished = False  # Boolean indicating if the equation system is established
        self.isCircuitLinear = False  # Boolean indicating if the circuit has been linearized
        self.equations = []  # List of Sympy Equation objects

    def addComponent(self, component):
        """
        Add a component to the circuit.

        Args:
            component (Component): The component to add to the circuit.
        """
        self.components.append(component)

    def linearizeCircuit(self):
        try:
            logging.info("Starting to linearize circuit.")
            for component in self.components:
                if not component.isLinear:
                    logging.info(f"Linearizing nonlinear component: {component.name}")
                    linearizedComponents = component.getLinearizedVersion()
                    for linearizedComponent in linearizedComponents:
                        self.components.append(linearizedComponent)
            self.isCircuitLinear = True
            logging.info("Finished linearizing circuit.")
        except Exception as e:
            logging.error(f"Error linearizing circuit: {e}")
            raise

    def buildConnexionList(self):
        try:
            logging.info("Starting to build connection list.")
            if not self.isCircuitLinear:
                self.linearizeCircuit()
            for component in self.components:
                if component.isLinear :
                    for node in component.nodes:
                        self.connections[node].append(component)
                        if node not in self.nodes:
                            self.nodes.append(node)
            self.isConnexionListBuilt = True
            logging.info("Finished building connection list.")
        except Exception as e:
            logging.error(f"Error building connection list: {e}")
            raise

    def componentConnectedTo(self, node):
        """
        Return a list of all components connected to a given node.

        Args:
            node (str): The node to check for connected components.

        Returns:
            list: List of components connected to the given node.
        """
        # TODO: Implement the method to return components connected to a node
        pass

    def setNodes(self, nodes):
        """
        Set the list of nodes in the circuit.

        Args:
            nodes (list): List of nodes in the circuit.
        """
        self.nodes = nodes

class Solver:
    """
    Handles Sympy manipulations for solving the circuit equations.

    Attributes:
        circuit (Circuit): The circuit instance associated with the solver.
    """

    def __init__(self, circuit):
        """
        Initialize the Solver with a specific circuit.

        Args:
            circuit (Circuit): The circuit to be solved.
        """
        self.circuit = circuit
        # First linearize the circuit
        if not self.circuit.isCircuitLinear:
            self.circuit.linearizeCircuit()
        self.nodeVoltages = {} # Dictionary of unknown node voltages
        self.unknownCurrents = {} # Dictionary of unknown branch currents
        self.knownParameters = {} # Dictionary of known values (e.g., resistors, input voltages, etc.)
        self.equations = []
        self.solutions = None
        self.transferFunction = None

        self.knownParameters["p"] = sympy.symbols('p') # Laplace variable

        # Populate the knownParameters dictionary with component
        for component in circuit.components:
            if component.isLinear:
                if component.isVirtual==False:
                    if isinstance(component, Resistor) or isinstance(component, Inductor) or isinstance(component, Capacitor):
                        self.knownParameters[component.name] = sympy.symbols(f'{component.name}')
                    elif isinstance(component, VoltageSource):
                        self.knownParameters[component.name] = sympy.symbols(f'{component.name}')

        # Populate the nodeVoltages dictionary with node names
        for node in circuit.nodes:
            if node != '0':
                self.nodeVoltages[node] = sympy.symbols(f'v_{node}')
            else :
                self.nodeVoltages['0'] = 0 # TODO améliorer cette partie, ce n'est pas très rigoureux de mettre la masse dans nodeVoltages

        # Populate the unknownCurrents dictionary with branch names
        for component in circuit.components:
            if isinstance(component, VoltageSource):
                self.unknownCurrents[component.nodes[0]] = sympy.symbols(f'i_{component.nodes[0]}')


    def getEqSys(self):
        """
        Establish the system of equations from the circuit.

        Returns:
            list: A list of Sympy equations representing the circuit.
        """
        logging.info("Starting to establish the system of equations.")
        # Analyse nodale classique
        for node in self.circuit.nodes:
            if node != '0':
                # Equation de noeud
                expr = 0
                for component in self.circuit.connections[node]:
                    if component.isLinear: # Only linear components have equations
                        expr += component.getEquation(node, self.nodeVoltages, self.unknownCurrents, self.knownParameters)
                equation = sympy.Eq(expr, 0)
                explanation = f"Loi des noeuds pour le noeud {node}"
                self.equations.append((equation,explanation)) 

        # Ajout des equations pour les composants spéciaux (sources de tension, courant, etc.)
        for component in self.circuit.components:
            if component.isLinear:
                if component.needsAdditionalEquation:
                    (equ,explanation)=component.getAdditionalEquation(self.nodeVoltages, self.unknownCurrents, self.knownParameters)
                    self.equations.append((equ, explanation))
        logging.info("Finished establishing the system of equations.")

    def solveEqSys(self):
        """
        Solve the system of equations to find the transfer function.

        Returns:
            dict: A dictionary of solutions for the variables in the circuit.
        """
        try:
            logging.info("Starting to solve the system of equations.")
            unknowns = [x for x in list(self.nodeVoltages.values()) if x != 0] + list(self.unknownCurrents.values()) 
            self.solutions = sympy.solve([equ for equ,expl in self.equations], unknowns)
            logging.info("Finished solving the system of equations.")
            return self.solutions
        except Exception as e:
            logging.error(f"Error solving equation system: {e}")
            raise
    
    def getTransferFunction(self, inputNode, outputNode):
        """
        Get the transfer function of the circuit.

        Args:
            inputNode (str): The node where the input voltage is applied.
            outputNode (str): The node where the output voltage is measured.

        Returns:
            sympy.Expr: The transfer function of the circuit.
        """
        if inputNode not in self.nodeVoltages or outputNode not in self.nodeVoltages:
            logging.error(f"Input node '{inputNode}' or output node '{outputNode}' not found in nodeVoltages.")
        logging.info(f"Calculating transfer function from {inputNode} to {outputNode}.")
        self.transferFunction = sympy.simplify(self.solutions[self.nodeVoltages[outputNode]] / self.solutions[self.nodeVoltages[inputNode]])
        logging.info("Finished calculating transfer function.")
        return self.transferFunction


class Simulator:
    """
    Handles the numerical simulation of the circuit.
    """
    def __init__(self, circuit, analyticTransferFunction, laplaceVariable = sympy.symbols('p')):
        self.circuit = circuit  
        self.laplaceVariable = laplaceVariable
        self.paramValues = {} # Dictionary to replace the symbolic parameters with numerical values
        self.analyticTransferFunction = analyticTransferFunction
        self.num, self.denom = self.getNumericalTransferFunction()
        self.sys = lti(self.num, self.denom)

    def getNumericalTransferFunction(self):
        try:
            logging.info("Starting to get numerical transfer function.")
            p = self.laplaceVariable
            for component in self.circuit.components:
                if component.value != None:
                    self.paramValues[component.name] = component.value

            # Replace the symbolic parameters with numerical values
            self.transferFunction = self.analyticTransferFunction.subs(self.paramValues)
            missing_symbols = self.transferFunction.free_symbols - set(self.paramValues.keys()) - {self.laplaceVariable}
            if missing_symbols:
                logging.error(f"Missing numerical values for symbols: {missing_symbols}")
                raise ValueError("Error: Missing numerical values for symbols:", missing_symbols)
            # Extract numerator and denominator coefficients
            numerator, denominator = sympy.fraction(self.transferFunction)
            num_coeffs = [float(c) for c in numerator.as_poly(p).all_coeffs()]
            den_coeffs = [float(c) for c in denominator.as_poly(p).all_coeffs()]

            logging.info("Finished getting numerical transfer function.")
            return num_coeffs, den_coeffs
        except Exception as e:
            logging.error(f"Error getting numerical transfer function: {e}")
            raise

    def getStepResponse(self):
        try:
            logging.info("Starting to get step response.")
            t, y = step(self.sys)
            x = np.ones(len(t))
            # Insert t=0, y=0 and x=0 to have plotting beginning at zero
            t = np.insert(t, 0, 0)
            y = np.insert(y, 0, 0)
            x = np.insert(x, 0, 0)
            logging.info("Finished getting step response.")
            return t, x, y
        except Exception as e:
            logging.error(f"Error getting step response: {e}")
            raise

    def getFrequencyResponse(self):
        try:
            logging.info("Starting to get frequency response.")
            w, mag, phase = bode(self.sys)
            logging.info("Finished getting frequency response.")
            return w, mag, phase
        except Exception as e:
            logging.error(f"Error getting frequency response: {e}")
            raise

def build_prompt(netlist, solutions, transferFunction, equations):
    prompt = f"Voici la netlist d'un circuit d'électornique \n --- {netlist} \n ---Les équations sont \n ---"
    for equ,expl in equations:
        prompt+= str((f"{expl} : {sympy.latex(equ)}")) + "\n"
    prompt += "Voici les résultats de la résolution \n ---"
    for sol in solutions:
        prompt += str(f"{sympy.latex(sol)} = {sympy.latex(solutions[sol])}") + "\n"
    prompt += " --- Voici la fonction de transfert du circuit \n ---"
    prompt += str(f"Transfer Function: {sympy.latex(transferFunction)}") + "\n"
    prompt += " --- Si tu reconnais le circuit étudié, donne en une explication en une phrase et donne (latex) les paramètres les plus importants. Sinon dit que tu ne reconnais pas le circuit. Ne t'exprime pas avec 'je'"
    return prompt


def query_LLM(prompt):

    if not api_key:
        logging.warning("API key is missing.")
        raise ValueError("Error: API key is missing.")
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    url = 'https://openrouter.ai/api/v1/completions'
    data = {
        'model': 'gpt-3.5-turbo',  # Replace with your model
        'prompt': prompt,
        'max_tokens': 150
    }
    try:
        logging.info("Starting API request to OpenRouter.")
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raise an HTTPError if the response was unsuccessful
        response_json = response.json()
        if 'choices' not in response_json:
            logging.error("Error: 'choices' not found in response")
            raise ValueError("Error: 'choices' not found in response")
        logging.info("Finished API request to OpenRouter.")
        return response_json['choices'][0]['text']
    except requests.exceptions.RequestException as e:
        logging.error(f"An error occurred during the API request: {e}")
        raise ValueError(f"An error occurred during the API request: {e}")