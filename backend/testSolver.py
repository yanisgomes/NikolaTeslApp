from solver import Solver, Simulator, Circuit
from solver import query_LLM, build_prompt
from collections import defaultdict
import sympy as sp
from flask import Flask, request, jsonify
from flask_cors import CORS  # Pour gérer les requêtes CORS
import json
from solver import Parser
import matplotlib.pyplot as plt
import sys


netlist = '''
* https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA6.html
Vin 3 0 Symbolic      
R2 3 2 1000
R1 1 0 1000
C1 1 0 1u
C2 2 1 10u
L1 1 0 0.001
.end
'''

# Get the Circuit object
circuit = Circuit(netlist)

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



