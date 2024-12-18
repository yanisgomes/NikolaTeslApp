from solver import Solver, Simulator, Circuit
from solver import query_LLM, build_prompt
from collections import defaultdict
import sympy as sp
from flask import Flask, request, jsonify
from flask_cors import CORS  # Pour gérer les requêtes CORS
import json

circuit = Circuit()
circuit.addComponent(Resistor('R1', ['n1', 'n2']))
circuit.addComponent(Resistor('R2', ['n2', 'n3']))
circuit.addComponent(Resistor('R3', ['n2', 'n0']))
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

print("--- System of Equations ---")
for equ,expl in solver.equations:
    print(f"{expl} : {sp.latex(equ)}")

print("--- Solutions ---")
for sol in solver.solutions:
    print(f"{sp.latex(sol)} = {sp.latex(solver.solutions[sol])}")

print("--- Transfer Functions ---")
transferFunction = solver.getTransferFunction('3', '2')
print(f"Transfer Function: {transferFunction}")

# Call the API
prompt = build_prompt(netlist, solver.solutions, solver.analyticTransferFunction, solver.equations)
response = query_LLM(prompt)
print(response)
#sys.exit("Stopping the code execution here.")

num, denom = solver.getNumericalTransferFunction('3', '2')
simu = Simulator(circuit, num, denom)

t, x, y = simu.getStepResponse()
w, mag, phase = simu.getFrequencyResponse() 

plt.figure()
plt.plot(t, y, label='Output')
plt.plot(t, x, label='Input')
plt.title('Step Response')
plt.xlabel('Time (s)')
plt.ylabel('Output')
plt.legend()
plt.grid()

plt.figure()
plt.subplot(2, 1, 1)
plt.semilogx(w, mag)
plt.title('Magnitude Response')
plt.xlabel('Frequency (rad/s)')
plt.ylabel('Magnitude')
plt.grid()

plt.subplot(2, 1, 2)
plt.semilogx(w, phase)
plt.title('Phase Response')
plt.xlabel('Frequency (rad/s)')
plt.ylabel('Phase (degrees)')
plt.grid()

plt.show()



