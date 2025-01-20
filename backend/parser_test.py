import pytest
from parser123 import Parser
from component import Resistor

def test_resistor_parsing():
    netlist = "R1 1 2 10K"
    components, nodes = Parser.parse_netlist(netlist)
    
    assert len(components) == 1
    assert isinstance(components[0], Resistor)
    assert components[0].name == "R1"
    assert components[0].nodes == ["1", "2"]
    assert components[0].value == 10_000
    assert nodes == ["1", "2"]

test_resistor_parsing()
