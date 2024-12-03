"""
solver.py

This module defines the classes and methods necessary for building an analytical electronic circuit solver.
The solver is designed to produce transfer functions using Sympy for equation manipulation and solving.

Classes:
    Component: Represents an electronic component in the circuit.
    Circuit: Represents the entire electronic circuit and provides methods to analyze and solve it.

"""

import sympy
from collections import defaultdict
from abc import ABC, abstractmethod

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
        return nodeVoltages[node] - nodeVoltages[other_node] / knownParameters[self.name]
    
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
                self.equations.append(sympy.Eq(expr, 0))

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