"""
circuit.py

This module defines the class and methods necessary for building an analytical electronic circuit solver.
It uses Component objects defined in the component.py module
The solver.py code will then produce transfer functions using Sympy for equation manipulation and solving.

Classes:
    Circuit: Represents the entire electronic circuit and provides methods to analyze and solve it.
"""

import logging
from collections import defaultdict
import sympy
        
    
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
    def __init__(self, components, nodes):
        self.components = []  # List of Component instances
        self.nodes = []  # List of all nodes in the circuit
        self.connections = defaultdict(list)  # Dictionary mapping nodes to components
        self.isNodeComponentDicBuilt = False  # Boolean indicating if the connection list is built
        self.isEqSysEstablished = False  # Boolean indicating if the equation system is established
        self.isCircuitLinear = False  # Boolean indicating if the circuit has been linearized
        self.equations = []  # List of Sympy Equation objects

        self.components, self.nodes = components, nodes

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