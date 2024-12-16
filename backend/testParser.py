# test_parser.py

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