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

class Parser:
    """
    Parses a netlist string and returns a Circuit object with the components.
    Currently supports Resistors and Voltage Sources.
    """

    def __init__(self, netlist):
        self.netlist = netlist
        self.circuit = Circuit()
        self.parse_netlist()

    def parse_netlist(self):
        lines = self.netlist.strip().split('\n')
        for line in lines:
            line = line.strip()
            if not line or line.startswith('*') or line.startswith('.'):
                continue  # Skip comments and directives
            tokens = line.split()
            if not tokens:
                continue
            component_type = tokens[0][0].upper()  # First letter indicates component type
            name = tokens[0]
            nodes = tokens[1:3]

            if component_type == 'R':
                value = tokens[3]
                resistance = self.parse_value(value)
                self.circuit.addComponent(Resistor(name, resistance, nodes))
            elif component_type == 'V':
                # Handle voltage source
                value = self.extract_voltage_value(tokens)
                voltage = self.parse_value(value)
                self.circuit.addComponent(VoltageSource(name, voltage, nodes))

    def parse_value(self, value_str):
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
        match = re.match(r"([0-9\.]+)([A-Za-z]*)", value_str)
        if match:
            value, unit = match.groups()
            value = float(value)
            unit = unit.upper()
            multiplier = units.get(unit, 1)
            return value * multiplier
        else:
            return float(value_str)

    def extract_voltage_value(self, tokens):
        """
        Extracts the voltage value from the tokens for a voltage source.
        """
        if 'DC' in tokens:
            idx = tokens.index('DC')
            return tokens[idx + 1]
        elif 'AC' in tokens:
            idx = tokens.index('AC')
            return tokens[idx + 1]
        else:
            # Assume the value is in the third position
            return tokens[3]

    @staticmethod
    def get_circuit(self, netlist):
        self.parse_netlist(netlist)
        return self.circuit

class Component:
    """
    Represents an electronic component in the circuit.

    Attributes:
        name (str): The name of the component (e.g., 'R1', 'C1').
        value (float): The value of the component (e.g., resistance, capacitance).
        nodes (list): The list of nodes this component is connected to.
    """
    def __init__(self, name, nodes):
        self.name = name  # Component name (e.g., 'R1', 'C1')
        self.nodes = nodes  # List of nodes this component is connected to
        self.motherComponent = None  # Reference to the mother component (e.g., for linearized elements)
        self.isVirtual = False  # Boolean indicating if the component is virtual (e.g., for linearized elements)
        self.equation = None  # The Voltage-Current equation for the component
        self.needsAdditionalEquation = False
    
    def __str__(self):
        return f"{self.name} ({self.value}) [{self.nodes}]"
    
    @abstractmethod
    def getEquation(self, nodeVoltages, unknownCurrents, knownParameters):
        """
        TODO Return the Voltage-Current equation for the component.
        """
        

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
    def __init__(self, name, nodes):
        super().__init__(name, nodes)
    
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
    def __init__(self, name, nodes):
        super().__init__(name, nodes)
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
        return sympy.Eq(nodeVoltages[self.nodes[0]] - nodeVoltages[self.nodes[1]], knownParameters[self.name])

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
        self.equations = []  # List of Sympy Equation objects

    def addComponent(self, component):
        """
        Add a component to the circuit.

        Args:
            component (Component): The component to add to the circuit.
        """
        self.components.append(component)
        self.isConnexionListBuilt = False
        self.isEqSysEstablished = False

    def linearizeCircuit(self):
        """
        Handle the linearization of nonlinear circuit elements.
        """
        # TODO: Implement the method to linearize nonlinear circuit elements
        pass

    def buildConnexionList(self):
        """
        Fill the connections dictionary with components connected to each node.
        """
        for component in self.components:
            for node in component.nodes:
                self.connections[node].append(component)
                if node not in self.nodes:
                    self.nodes.append(node)
        self.isConnexionListBuilt = True

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
        self.nodeVoltages = {} # Dictionary of unknown node voltages
        self.unknownCurrents = {} # Dictionary of unknown branch currents
        self.knownParameters = {} # Dictionary of known values (e.g., resistors, input voltages, etc.)
        self.equations = []

        # Populate the knownParameters dictionary with component
        for component in circuit.components:
            if isinstance(component, Resistor):
                self.knownParameters[component.name] = sympy.symbols(f'{component.name}')
            elif isinstance(component, VoltageSource):
                self.knownParameters[component.name] = sympy.symbols(f'{component.name}')

        # Populate the nodeVoltages dictionary with node names
        for node in circuit.nodes:
            if node != 'n0':
                self.nodeVoltages[node] = sympy.symbols(f'v_{node}')
            else :
                self.nodeVoltages['n0'] = 0 # TODO améliorer cette partie, ce n'est pas très rigoureux de mettre la masse dans nodeVoltages

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
        # Analyse nodale classique
        for node in self.circuit.nodes:
            if node != 'n0':
                # Equation de noeud
                expr = 0
                for component in self.circuit.connections[node]:
                    expr += component.getEquation(node, self.nodeVoltages, self.unknownCurrents, self.knownParameters)
                equation = sympy.Eq(expr, 0)
                self.equations.append(equation) # TODO il manque un terme dans l'équation pour le noeud 2 de l'ex

        # Ajout des equations pour les composants spéciaux (sources de tension, courant, etc.)
        for component in self.circuit.components:
            if component.needsAdditionalEquation:
                self.equations.append(component.getAdditionalEquation(self.nodeVoltages, self.unknownCurrents, self.knownParameters))


    def solveEqSys(self):
        """
        Solve the system of equations to find the transfer function.

        Returns:
            dict: A dictionary of solutions for the variables in the circuit. TODO : remove() modifie la liste en place, ne renvoie rien ERROR
        """
        unknowns = [x for x in list(self.nodeVoltages.values()) if x != 0] + list(self.unknownCurrents.values()) 
        return sympy.solve(self.equations, unknowns)

class Parser:
    """
    Parses a netlist string and returns a Circuit object with the components.
    Currently supports Resistors and Voltage Sources.
    """

    def __init__(self, netlist):
        self.netlist = netlist
        self.circuit = Circuit()
        self.parse_netlist()

    def parse_netlist(self):
        lines = self.netlist.strip().split('\n')
        for line in lines:
            line = line.strip().upper()
            if not line or line.startswith('*') or line.startswith('.'):
                continue  # Skip comments and directives
            tokens = line.split()
            if not tokens:
                continue
            component_type = tokens[0][0].upper()  # First letter indicates component type
            name = tokens[0]
            nodes = tokens[1:3]

            if component_type == 'R':
                value = tokens[3]
                resistance = self.parse_value(value)
                self.circuit.addComponent(Resistor(name, nodes))
            elif component_type == 'V':
                # Handle voltage source
                value = self.extract_voltage_value(tokens)
                voltage = self.parse_value(value)
                self.circuit.addComponent(VoltageSource(name, nodes))

    def parse_value(self, value_str):
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
        match = re.match(r"([0-9\.]+)([A-Za-z]*)", value_str)
        if match:
            value, unit = match.groups()
            value = float(value)
            unit = unit.upper()
            multiplier = units.get(unit, 1)
            return value * multiplier
        else:
            return float(value_str)

    def extract_voltage_value(self, tokens):
        """
        Extracts the voltage value from the tokens for a voltage source.
        """
        if 'DC' in tokens:
            idx = tokens.index('DC')
            return tokens[idx + 1]
        elif 'AC' in tokens:
            idx = tokens.index('AC')
            return tokens[idx + 1]
        else:
            # Assume the value is in the third position
            return tokens[3]

    def get_circuit(self):
        return self.circuit