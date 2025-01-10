"""
component.py

This module contains the Component class and its subclasses representing electronic components in the circuit.
It is used to parse a netlist and construct the circuit components.
"""

from abc import ABC, abstractmethod
import sympy

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