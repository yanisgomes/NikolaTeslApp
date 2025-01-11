"""
solver.py

This module contains the Solver class which handles the symbolic manipulation of the circuit equations.
It uses sympy for symbolic manipulation. It builds upon the Circuit class.

Input : Circuit object (given by parser.py)
Output : 
- A list of Sympy equations representing the circuit
- A dictionary of solutions for the unknown parameters
- The transfer function of the circuit 
- Numerical transfer function coefficients (for later simulation in simulator.py)
"""

import sympy
from collections import defaultdict
from scipy.signal import TransferFunction, bode, step, lti
import numpy as np
import logging
from circuit import *
from component import *

# Configure logging at the beginning of the file
logging.basicConfig(level=logging.ERROR)




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


