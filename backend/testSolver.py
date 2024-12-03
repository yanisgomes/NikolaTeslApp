from solver import Component, Circuit, Resistor, VoltageSource, Solver
from collections import defaultdict
import sympy
from flask import Flask, request, jsonify
from flask_cors import CORS  # Pour gérer les requêtes CORS
import json

circuit = Circuit()
circuit.addComponent(Resistor('R1', ['n1', 'n2']))
circuit.addComponent(Resistor('R2', ['n2', 'n3']))
circuit.addComponent(Resistor('R3', ['n3', 'n0']))
circuit.addComponent(VoltageSource('U1', ['n1', 'n0']))
circuit.addComponent(VoltageSource('U2', ['n3', 'n0']))

nodes = ['n0', 'n1', 'n2', 'n3']

# Give nodes to the circuit
circuit.setNodes(nodes)

# Initialize the dictionaries
nodeVoltages = {}
unknownCurrents = {}
knownParameters = {}

# Populate the knownParameters dictionary with component
for component in circuit.components:
    if isinstance(component, Resistor):
        knownParameters[component.name] = sympy.symbols(f'{component.name}')
    elif isinstance(component, VoltageSource):
        knownParameters[component.name] = sympy.symbols(f'{component.name}')

# Populate the nodeVoltages dictionary with node names
for node in circuit.nodes:
    if node != 'n0':
        nodeVoltages[node] = sympy.symbols(f'v_{node}')
    else :
        nodeVoltages['n0'] = 0 # TODO améliorer cette partie, ce n'est pas très rigoureux de mettre la masse dans nodeVoltages

# Populate the unknownCurrents dictionary with branch names
for component in circuit.components:
    if isinstance(component, VoltageSource):
        unknownCurrents[component.nodes[0]] = sympy.symbols(f'i_{component.nodes[0]}')

# Print the dictionaries for verification
print("Unknown Voltages:", nodeVoltages)
print("Knowns:", knownParameters)
print("Unknown Currents:", unknownCurrents)

# Initialize the solver with the circuit
solver = Solver(circuit)

# Build the connection list
circuit.buildConnexionList()

# Sera effectué dans la classe solver à l'initialisation
solver.nodeVoltages = nodeVoltages
solver.unknownCurrents = unknownCurrents
solver.knownParameters = knownParameters

# Get the system of equations
solver.getEqSys()


# Solve the system of equations
solutions = solver.solveEqSys()

# Print the solutions
print(solutions)
