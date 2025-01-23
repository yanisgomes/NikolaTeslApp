import pytest
from parser123 import Parser
from component import Resistor, VoltageSource, CurrentSource, Inductor, Capacitor, Opamp

# 1. Tests fonctionnels de base

def test_resistors_only():
    netlist = """
    R1 1 2 10K
    R2 2 3 1K
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert len(components) == 2
    assert isinstance(components[0], Resistor)
    assert isinstance(components[1], Resistor)
    assert components[0].value == 10_000
    assert components[1].value == 1_000

def test_voltage_and_current_sources():
    netlist = """
    V1 1 0 DC 5
    I1 2 3 1A
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert len(components) == 2
    assert isinstance(components[0], VoltageSource)
    assert isinstance(components[1], CurrentSource)
    assert components[0].value == 5
    assert components[1].value == 1

    # Conflict checks
    conflicting_netlist = """
    V1 1 0 DC 5
    V2 1 0 DC 10
    """
    with pytest.raises(ValueError, match="multiple voltage sources connected to the same nodes"):
        Parser.parse_netlist(conflicting_netlist)

    conflicting_current_netlist = """
    I1 2 3 1A
    I2 3 2 2A
    """
    with pytest.raises(ValueError, match="multiple current sources in series"):
        Parser.parse_netlist(conflicting_current_netlist)

def test_passive_and_active_components():
    netlist = """
    R1 1 2 10K
    L1 2 3 1H
    C1 3 4 100U
    O1 4 5 6
    """
    components, _ = Parser.parse_netlist(netlist)

    assert len(components) == 4
    assert isinstance(components[0], Resistor)
    assert isinstance(components[1], Inductor)
    assert isinstance(components[2], Capacitor)
    assert isinstance(components[3], Opamp)

# 2. Tests des cas limites

def test_empty_lines_and_comments():
    netlist = """
    * This is a comment
    .control
    R1 1 2 10K

    * Another comment
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert len(components) == 1
    assert isinstance(components[0], Resistor)

def test_shared_nodes():
    netlist = """
    R1 1 2 10K
    C1 2 3 1U
    L1 3 4 1H
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert len(components) == 3

def test_symbolic_values():
    netlist = """
    R1 1 2 SYMBOLIC
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert len(components) == 1
    assert components[0].value is None

# 3. Tests de parsing des valeurs

def test_values_with_units():
    netlist = """
    R1 1 2 1K
    C1 2 3 100U
    L1 3 4 1H
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert components[0].value == 1_000
    assert components[1].value == 100e-6
    assert components[2].value == 1

def test_values_without_units():
    netlist = """
    R1 1 2 10
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert components[0].value == 10

def test_unknown_units():
    netlist = """
    R1 1 2 100Z
    """
    with pytest.raises(ValueError, match="Error parsing value"):
        Parser.parse_netlist(netlist)

# 4. Tests des erreurs

def test_incorrect_syntax():
    netlist = """
    R1 1 2
    """
    with pytest.raises(ValueError, match="Error parsing netlist"):
        Parser.parse_netlist(netlist)

def test_unknown_component():
    netlist = """
    Z1 1 2 100
    """
    with pytest.raises(ValueError, match="Unknown component type"):
        Parser.parse_netlist(netlist)

def test_non_numeric_values():
    netlist = """
    R1 1 2 1A
    """
    with pytest.raises(ValueError, match="Error parsing value"):
        Parser.parse_netlist(netlist)

# 5. Tests de performance et robustesse

def test_large_netlist():
    netlist = "\n".join([f"R{i} {i} {i+1} 1K" for i in range(1000)])
    components, _ = Parser.parse_netlist(netlist)
    
    assert len(components) == 1000

def test_extreme_values():
    netlist = """
    R1 1 2 1P
    R2 2 3 1T
    """
    components, _ = Parser.parse_netlist(netlist)
    
    assert components[0].value == 1e-12
    assert components[1].value == 1e12
