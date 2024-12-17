from solver import Solver
from solver import query_LLM, build_prompt
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

# Get the Circuit object
circuit = Parser.parse_netlist(netlist, compute_numeric=False)

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
for equ,expl in solver.equations:
    print(f"{expl} : {sympy.latex(equ)}")


# Solve the system of equations
solutions = solver.solveEqSys()

# Print the solutions
for sol in solutions:
    print(f"{sympy.latex(sol)} = {sympy.latex(solutions[sol])}")

prompt = build_prompt(netlist, solutions, solver.equations)

# Call the API
response = query_LLM(prompt)
print(response)


