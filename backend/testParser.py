# test_parser.py

from solver import Parser

netlist = '''
* Simple Resistor and Voltage Source Circuit
v1 1 0 dc 24 
C1 1 2 10k 
L1 2 3 8.1k 
r 3 0 4.7k 
.end
'''

# Create a Parser instance with the netlist
parser = Parser(netlist)

# Get the Circuit object
circuit = parser.get_circuit()

# Print the components in the circuit
for component in circuit.components:
    print(f"Component: {component}")