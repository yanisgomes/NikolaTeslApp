from solver import Component, Circuit, Resistor, VoltageSource, Solver, Inductor, Capacitor, Opamp
from collections import defaultdict
import sympy
from flask import Flask, request, jsonify
from flask_cors import CORS  # Pour gérer les requêtes CORS
import json
from solver import Parser

netlist = '''
* Opamp inverter : https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA6.html
Vin 3 0 Symbolic      
R1 1 3 Symbolic
R2 2 1 Symbolic
OAmp 0 1 2
.end
'''

# Create a Parser instance with the netlist
parser = Parser(netlist)

# Get the Circuit object
circuit = parser.get_circuit()

# Print the components in the circuit
for component in circuit.components:
    print(f"Component: {component}")

# Build the connection list
circuit.buildConnexionList()

# Initialize the solver with the circuit
solver = Solver(circuit)

# Print the dictionaries for verification
print("Unknown Voltages:", solver.nodeVoltages)
print("Knowns:", solver.knownParameters)
print("Unknown Currents:", solver.unknownCurrents)

# Get the system of equations
solver.getEqSys()

# Print the system of equations
print(solver.eqSys)

# Solve the system of equations
solutions = solver.solveEqSys()

# Print the solutions
print(solutions)
