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
        """
        Parses the netlist string and returns a list of Component objects and a list of nodes.

        Args:
            netlist (str): The netlist string representing the circuit.
            compute_numeric (bool): Flag to indicate whether to look for numeric values in netlist.

        Returns:
            tuple: A tuple containing a list of Component objects and a list of nodes.
        """
        try:
            logging.info("Starting to parse netlist.")
            component_list, node_list = [], []
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
                elif component_type == 'I': # Current source
                    component = CurrentSource(name, nodes, value)
                else:
                    logging.error(f"Unknown component type: {component_type}")
                    raise ValueError(f"Unknown component type: {component_type}")
                
                component_list.append(component)

                for node in nodes:
                    if node not in nodes:
                        node_list.append(node) # add new nodes the circuit.nodes list

            node_list.sort()
            logging.info("Finished parsing netlist.")
            return component_list, node_list
        except Exception as e:
            logging.error(f"Error parsing netlist: {e}")
            raise

    @staticmethod
    def parse_value(value_str):
        """
        Parses the value string, handling units, and returns a numerical value.

        Args:
            value_str (str): The value string to be parsed.

        Returns:
            float: The numerical value of the component.
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
        Extracts the voltage token from the tokens. The value token may be at different positions depending on the component.

        Args:
            component_type (str): The type of the component (e.g., 'R', 'V').
            tokens (list): The list of tokens from the netlist line.

        Returns:
            str: The extracted value token.
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
        Extracts the node tokens from the tokens. Depending on the component, there may be more than two nodes.

        Args:
            tokens (list): The list of tokens from the netlist line.
            component_type (str): The type of the component (e.g., 'R', 'V').

        Returns:
            list: The list of node tokens.
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
        Return the Voltage-Current equation for the component.

        Args:
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            sympy.Expr: The Voltage-Current equation for the component.
        """
        
    @abstractmethod
    def linearize(self): 
        """ 
        Linearize the component to handle nonlinear elements.

        Returns:
            list: A list of linear components for the equivalent linear circuit .
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

        Args:
            node (str): The node for which the equation is being generated.
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            sympy.Expr: The Voltage-Current equation for the resistor.
        """
        other_node = self.nodes[0] if self.nodes[1] == node else self.nodes[1]
        return (nodeVoltages[node] - nodeVoltages[other_node]) / knownParameters[self.name]
    
class VoltageSource(Component):
    """
    Represents a voltage source component in the circuit.
    The voltage of the source V = V_node[0] - V_node[1].
    To solve the circuit, we add a new unknown branch current for the voltage source defined as I_voltage_source_name. It is positive if it flows from the node[1] to node[0].

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
        Return the Voltage-Current equation for the voltage source. It is positive if it flows from the node[1] to node[0].

        Args:
            node (str): The node for which the equation is being generated.
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            sympy.Expr: The Voltage-Current equation for the voltage source.
        """
        if node == self.nodes[0]: # The current is positive if it flows from the node[1] to node[0]
            return unknownCurrents[self.name]
        else :
            return -unknownCurrents[self.name]

    def getAdditionalEquation(self, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the additional equation for the voltage source.

        Args:
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            tuple: A tuple containing the additional equation and its explanation.
        """
        return (sympy.Eq(nodeVoltages[self.nodes[0]] - nodeVoltages[self.nodes[1]], knownParameters[self.name]), f"valeur de la source de tension {self.name}")

class CurrentSource(Component):
    """
    Represent a current source. The current source is handled in MNA by adding a new unknown branch current and no additional equation is needed.

    Attributes:
        name (str): The name of the current source (e.g., 'I1').
        value (float): The current value in Amperes.
        nodes (list): The list of nodes this current source is connected to.
    """
    def __init__(self, name, nodes, value=None):
        super().__init__(name, nodes, value)
    
    def getEquation(self, node, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the Voltage-Current equation for the current source.

        Args:
            node (str): The node for which the equation is being generated.
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            sympy.Expr: The Voltage-Current equation for the current source.
        """
        if node == self.nodes[0]: # The current is positive if it flows from the node[1] to node[0]
            return unknownCurrents[self.name]
        else :
            return -unknownCurrents[self.name]
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

        Args:
            node (str): The node for which the equation is being generated.
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            sympy.Expr: The Voltage-Current equation for the inductor.
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

        Args:
            node (str): The node for which the equation is being generated.
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            sympy.Expr: The Voltage-Current equation for the capacitor.
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

        Args:
            node (str): The node for which the equation is being generated.
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            sympy.Expr: The Voltage-Current equation for the wire.
        """
        return 0

    def getAdditionalEquation(self, nodeVoltages, unknownCurrents, knownParameters):
        """
        Return the additional equation for the wire.

        Args:
            nodeVoltages (dict): Dictionary of node voltages.
            unknownCurrents (dict): Dictionary of unknown branch currents.
            knownParameters (dict): Dictionary of known parameters.

        Returns:
            tuple: A tuple containing the additional equation and its explanation.
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
        Linearize the opamp to handle nonlinear elements.

        Returns:
            list: A list of linearized components.
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
        isNodeComponentDicBuilt (bool): Indicates if the connection list is built.
        isEqSysEstablished (bool): Indicates if the equation system is established.
        equations (list): List of Sympy Equation objects representing the circuit equations.
    """
    def __init__(self, netlist):
        self.components = []  # List of Component instances
        self.nodes = []  # List of all nodes in the circuit
        self.connections = defaultdict(list)  # Dictionary mapping nodes to components
        self.isNodeComponentDicBuilt = False  # Boolean indicating if the connection list is built
        self.isEqSysEstablished = False  # Boolean indicating if the equation system is established
        self.isCircuitLinear = False  # Boolean indicating if the circuit has been linearized
        self.equations = []  # List of Sympy Equation objects

        # Parse the netlist to get the components and nodes
        self.components, self.nodes = Parser.parse_netlist(netlist)


        # Build the node to component dictionary
        self.buildNodeComponentDic()

    def addComponent(self, component):
        """
        Add a component to the circuit.

        Args:
            component (Component): The component to add to the circuit.
        """
        self.components.append(component)

    def linearizeCircuit(self):
        """
        Handle the linearization of nonlinear circuit elements.

        Raises:
            Exception: If an error occurs during linearization.
        """
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

    def buildNodeComponentDic(self):
        """
        Build a dictionary mapping nodes to components. Used to iterate over the components connected to a node during nodal analysis.

        Raises:
            Exception: If an error occurs during building the connection list.
        """
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
            self.isNodeComponentDicBuilt = True
            logging.info("Finished building connection list.")
        except Exception as e:
            logging.error(f"Error building connection list: {e}")
            raise

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
        It starts from a circuit and gives the expression of every voltage and current in the circuit in terms of the known parameters.
  
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
        self.equations = [] # List of equations used to solve every current and voltage in the circuit
        self.solutions = None # Dictionary of solutions for the unknowns parameters expressed in terms of the known parameters
        self.analyticTransferFunction = None # Symbols are still used for known parameters
        self.paramValues = {} # Dictionary to replace the symbolic parameters with numerical values

        self.initializeKnownParameters()
        self.initializeUnknownParameters()
        self.getEqSys()
        self.solveEqSys()


    def initializeKnownParameters(self):
        """
        Initialize a dictionary with key component.name and value sympy.symbols(f'{component.name}') for each linear component in the circuit.
        """
        self.knownParameters["p"] = sympy.symbols('p') # Laplace variable
        for component in self.circuit.components:
            if component.isLinear:
                if component.isVirtual==False:
                    if isinstance(component, Resistor) or isinstance(component, Inductor) or isinstance(component, Capacitor):
                        self.knownParameters[component.name] = sympy.symbols(f'{component.name}')
                    elif isinstance(component, VoltageSource):
                        self.knownParameters[component.name] = sympy.symbols(f'{component.name}')

    def initializeUnknownParameters(self):
        """
        Initialize dictionaries of key node and value sympy.symbols(f'v_{node}') for each node and branch in the circuit and sympy.symbols(f'i_{branch}') for each voltage source.
        """ 
        # Populate the nodeVoltages dictionary with node names
        for node in self.circuit.nodes:
            if node != '0':
                self.nodeVoltages[node] = sympy.symbols(f'v_{node}')
            else :
                self.nodeVoltages['0'] = 0 # TODO améliorer cette partie, ce n'est pas très rigoureux de mettre la masse dans nodeVoltages

        # Populate the unknownCurrents dictionary with branch names
        # For each voltage source we add a unknown current, this is how MNA solvers parametrize the problem. 
        # The keys of the dictionnary are the name of the source and the value is the unknown current.
        for component in self.circuit.components:
            if isinstance(component, VoltageSource) or isinstance(component, CurrentSource):
                self.unknownCurrents[component.name] = sympy.symbols(f'i_{component.name}')


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

        Raises:
            Exception: If an error occurs during solving the equation system.
        """
        try:
            logging.info("Starting to solve the system of equations.")
            unknowns = [x for x in list(self.nodeVoltages.values()) if x != 0] + list(self.unknownCurrents.values()) 
            self.solutions = sympy.solve([equ for equ,expl in self.equations], unknowns)
            logging.info("Finished solving the system of equations.")
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

        Raises:
            ValueError: If the input or output node is not found in nodeVoltages.
        """
        if inputNode not in self.nodeVoltages or outputNode not in self.nodeVoltages:
            logging.error(f"Input node '{inputNode}' or output node '{outputNode}' not found in nodeVoltages.")
        logging.info(f"Calculating transfer function from {inputNode} to {outputNode}.")
        self.analyticTransferFunction = sympy.simplify(self.solutions[self.nodeVoltages[outputNode]] / self.solutions[self.nodeVoltages[inputNode]])
        logging.info("Finished calculating transfer function.")
        return self.analyticTransferFunction
    
    def getNumericalTransferFunction(self, inputNode, outputNode):
        """
        Return two lists: the numerator and the denominator coefficients of the transfer function.

        Args:
            inputNode (str): The node where the input voltage is applied.
            outputNode (str): The node where the output voltage is measured.

        Returns:
            tuple: A tuple containing two lists - the numerator and the denominator coefficients of the transfer function.

        Raises:
            Exception: If an error occurs during getting the numerical transfer function.
        """
        analytictf = self.getTransferFunction(inputNode, outputNode)
        try:
            logging.info("Starting to get numerical transfer function.")
            p = self.knownParameters["p"]
            for component in self.circuit.components:
                if component.value != None:
                    self.paramValues[component.name] = component.value

            # Replace the symbolic parameters with numerical values
            analytictf = self.analyticTransferFunction.subs(self.paramValues)
            missing_symbols = analytictf.free_symbols - set(self.paramValues.keys()) - {p}
            if missing_symbols:
                logging.error(f"Missing numerical values for symbols: {missing_symbols}")
                raise ValueError("Error: Missing numerical values for symbols:", missing_symbols)
            
            # Extract numerator and denominator coefficients
            numerator, denominator = sympy.fraction(analytictf)
            num_coeffs = [float(c) for c in numerator.as_poly(p).all_coeffs()]
            den_coeffs = [float(c) for c in denominator.as_poly(p).all_coeffs()]

            logging.info("Finished getting numerical transfer function.")
            return num_coeffs, den_coeffs
        except Exception as e:
            logging.error(f"Error getting numerical transfer function: {e}")
            raise


class Simulator:
    """
    Handles the numerical simulation of the circuit.

    Attributes:
        circuit (Circuit): The circuit instance associated with the simulator.
        num (list): The numerator coefficients of the transfer function.
        denom (list): The denominator coefficients of the transfer function.
    """
    def __init__(self, circuit, num, denom):
        self.circuit = circuit  
        self.num, self.denom = num, denom
        self.sys = lti(self.num, self.denom) # create a scipy linear time invariant system

    def getStepResponse(self):
        """
        Get the step response of the circuit.

        Returns:
            tuple: A tuple containing the time array, input array, and output array of the step response.

        Raises:
            Exception: If an error occurs during getting the step response.
        """
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
        """
        Get the frequency response of the circuit.

        Returns:
            tuple: A tuple containing the frequency array, magnitude array, and phase array of the frequency response.

        Raises:
            Exception: If an error occurs during getting the frequency response.
        """
        try:
            logging.info("Starting to get frequency response.")
            w, mag, phase = bode(self.sys)
            logging.info("Finished getting frequency response.")
            return w, mag, phase
        except Exception as e:
            logging.error(f"Error getting frequency response: {e}")
            raise

def build_prompt(netlist, solutions, transferFunction, equations):
    """
    Build a prompt string for querying the LLM.

    Args:
        netlist (str): The netlist string representing the circuit.
        solutions (dict): The dictionary of solutions for the variables in the circuit.
        transferFunction (sympy.Expr): The transfer function of the circuit.
        equations (list): The list of Sympy equations representing the circuit.

    Returns:
        str: The prompt string for querying the LLM.
    """
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
    """
    Query the LLM with the given prompt.

    Args:
        prompt (str): The prompt string for querying the LLM.

    Returns:
        str: The response from the LLM.

    Raises:
        ValueError: If the API key is missing or an error occurs during the API request.
    """
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