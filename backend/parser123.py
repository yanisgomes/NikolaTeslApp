"""
parser.py

This module contains the Parser class which is responsible for parsing the netlist string and returning a Circuit object with the components.

Input : netlist string
Output : 
- component_list
- node_list

Used in the solver.py module to parse the netlist string and get the components of the circuit.
It is called parser123 to avoid conflicts with the existing parser.py module in python
"""

import numpy as np
import logging
from component import VoltageSource, Resistor, Inductor, Capacitor, Opamp, CurrentSource
import re
import json

class Parser:
    """
    The parse_netlist static method parses a netlist string and returns a Circuit object with the components.
    """
    @staticmethod
    def json_to_netlist(json_data):
        """
        Converts the JSON data to a netlist string.

        Args:
            json_data (dict): The JSON data to be converted.

        Returns:
            str: The netlist string.
        """
        try:
            logging.info("Starting to convert JSON to netlist.")

            # If json_data is a string, parse it to a Python list/dict
            if isinstance(json_data, str):
                json_data = json.loads(json_data)

            link_dict, noeud_dict, components_dict = Parser.extract_dictionaries(json_data)
            # Preprocess link_dict to split component-to-component links
            new_links, noeud_dict = Parser.preprocess_links(link_dict, noeud_dict, components_dict)
            # Now build netlist with no direct component-to-component links:
            try:
                netlist = Parser.build_netlist(new_links, noeud_dict, components_dict)
                print("Netlist:\n", netlist)
            except ValueError as e:
                print("Error building netlist:", e)
            logging.info("Finished converting JSON to netlist.")
            return netlist
        except Exception as e:
            logging.error(f"Error converting JSON to netlist: {e}")
            raise

    @staticmethod
    def parse_netlist(netlist, compute_numeric=True):
        """
        Parses the netlist string and returns a list of Component objects and a list of nodes.

        Args:
            netlist (str): The netlist string representing the circuit.
            compute_numeric (bool): Flag to indicate whether to look for numeric values in netlist.

        Returns:
            tuple: A tuple containing a list of Component objects and a list of nodes.
        """
        try:
            logging.info("Starting to parse netlist.")
            component_list, node_list = [], []
            lines = netlist.strip().split('\n')
            value = None
            for line in lines:
                line = line.strip().upper()
                if not line or line.startswith('*') or line.startswith('.'):
                    continue  # Skip comments and directives
                tokens = line.split()
                if not tokens:
                    logging.warning(f"Empty tokens found in line: {line}")
                    continue

                component_type = tokens[0][0].upper()  # First letter indicates component type
                name = tokens[0]
                nodes = Parser.extract_node_tokens(tokens, component_type)
                
                if compute_numeric:
                    value_token = Parser.extract_value_token(component_type, tokens)
                    if value_token != None: # Symbolic is used to indicate that the value is not known (input variable for instance)
                        value = Parser.parse_value(value_token)
                
                if component_type == 'R': # Resistor
                    component = Resistor(name, nodes, value)
                elif component_type == 'V': # Voltage source
                    for c in component_list:
                        if isinstance(c, VoltageSource) and (c.nodes == nodes or c.nodes == [nodes[1],nodes[0]]):
                            logging.error(f"Error: multiple voltage sources connected to the same nodes: {nodes}")
                            raise ValueError(f"Error: multiple voltage sources connected to the same nodes: {nodes}")
                    component = VoltageSource(name, nodes, value)
                elif component_type == 'I': # Current source
                    for c in component_list:
                        if isinstance(c, CurrentSource) and (c.nodes[0] in nodes or c.nodes[1] in nodes):
                            logging.error(f"Error: multiple current sources in series: node {nodes}")
                            raise ValueError(f"Error: multiple current sources in series: node {nodes}")
                    component = CurrentSource(name, nodes, value)
                elif component_type == 'L': # Inductor
                    component = Inductor(name, nodes, value)
                elif component_type == 'C': # Capacitor
                    component = Capacitor(name, nodes, value)
                elif component_type == 'O': # Opamp
                    component = Opamp(name, nodes)
                elif component_type == 'I': # Current source
                    component = CurrentSource(name, nodes, value)
                else:
                    logging.error(f"Unknown component type: {component_type}")
                    raise ValueError(f"Unknown component type: {component_type}")
                
                component_list.append(component)

                for node in nodes:
                    if node not in nodes:
                        node_list.append(node) # add new nodes the circuit.nodes list

            node_list.sort()
            logging.info("Finished parsing netlist.")
            return component_list, node_list
        except Exception as e:
            logging.error(f"Error parsing netlist: {e}")
            raise

    @staticmethod
    def parse_value(value_str):
        """
        Parses the value string, handling units, and returns a numerical value.

        Args:
            value_str (str): The value string to be parsed.

        Returns:
            float: The numerical value of the component.
        """
        units = {
            'T': 1e12,
            'G': 1e9,
            'MEG': 1e6,
            'K': 1e3,
            'M': 1e-3,
            'MIL': 25.4e-6,
            'U': 1e-6,
            'N': 1e-9,
            'P': 1e-12,
            'F': 1e-15,
        }
        try:
            match = re.match(r"([0-9\.]+)([A-Za-z]*)", value_str)
            if match:
                value, unit = match.groups()
                value = float(value)
                unit = unit.upper()
                multiplier = units.get(unit, 1)
                return value * multiplier
            else:
                return float(value_str)
        except ValueError as e:
            logging.error(f"Error parsing value '{value_str}': {e}")
            raise

    @staticmethod
    def extract_value_token(component_type, tokens):
        """
        Extracts the voltage token from the tokens. The value token may be at different positions depending on the component.

        Args:
            component_type (str): The type of the component (e.g., 'R', 'V').
            tokens (list): The list of tokens from the netlist line.

        Returns:
            str: The extracted value token.
        """
        if component_type == 'V':
            if 'DC' in tokens:
                idx = tokens.index('DC')
                return tokens[idx + 1]
            elif 'AC' in tokens: # TODO numeric computation of AC is not handled
                logging.warning("AC voltage sources are not supported.")
                raise ValueError("AC voltage sources are not supported.")
            # else:
            #     # Assume the value is in the third position
            #     return tokens[3]
        else:
            return tokens[3]
    
    @staticmethod
    def extract_node_tokens(tokens, component_type):
        """
        Extracts the node tokens from the tokens. Depending on the component, there may be more than two nodes.

        Args:
            tokens (list): The list of tokens from the netlist line.
            component_type (str): The type of the component (e.g., 'R', 'V').

        Returns:
            list: The list of node tokens.
        """
        if component_type == 'O':
            return tokens[1:4]
        else :
            return tokens[1:3]

    @staticmethod 
    def extract_dictionaries(data):
        """
        Extracts the link, noeud, and components dictionaries from the JSON data.
        Used in the json_to_netlist method.
        """
        link_dict = {}
        noeud_dict = {}
        components_dict = {}

        for element in data:
            elem_type = element.get("type")
            if elem_type == "link":
                link_dict[element["id"]] = element
            elif elem_type == "noeud":
                noeud_dict[element["id"]] = element
            else:
                components_dict[element["id"]] = element

        return link_dict, noeud_dict, components_dict

    @staticmethod
    def preprocess_links(link_dict, noeud_dict, components_dict):
        """
        Preprocess link_dict so that there are no direct component-to-component links.
        If a direct link is found, create or reuse an intermediate node.
        Used in the json_to_netlist method.
        """

        link_nodes = {}  # Will map a pair of component IDs to a node ID
        new_links = {}

        # We may need an incremental way to create new node IDs or names
        # For example, start from the current count of noeuds:
        next_node_index = len(noeud_dict) + 1

        # We'll iterate over original links, building new ones in new_links
        for link_key, link_value in link_dict.items():
            source_id = link_value["source"]["id"]
            target_id = link_value["target"]["id"]

            source_is_comp = source_id in components_dict
            target_is_comp = target_id in components_dict

            if source_is_comp and target_is_comp:
                # We have a direct component-to-component link
                pair = tuple(sorted([source_id, target_id]))  # Use sorted so (A,B) == (B,A)

                if pair not in link_nodes:
                    # Create a new node
                    new_node_name = f"n{next_node_index}_auto"
                    next_node_index += 1
                    # Store it in noeud_dict (so that build_netlist sees it as a node)
                    noeud_dict[new_node_name] = {
                        "id": new_node_name,
                        "name": new_node_name
                    }
                    link_nodes[pair] = new_node_name

                # Retrieve or newly created node name
                node_id = link_nodes[pair]

                # Create two new links in new_links
                #  e.g. linkA: source=component, target=node
                #  e.g. linkB: source=node,      target=component
                linkA_key = f"{link_key}_A"
                linkB_key = f"{link_key}_B"
                
                new_links[linkA_key] = {
                    "source": {"id": source_id},
                    "target": {"id": node_id}
                }
                new_links[linkB_key] = {
                    "source": {"id": node_id},
                    "target": {"id": target_id}
                }

            else:
                # No change needed: either source or target is already a node
                new_links[link_key] = link_value

        return new_links, noeud_dict

    @staticmethod
    def build_netlist(link_dict, noeud_dict, components_dict):
        """
        Build a netlist string from the dictionaries.
        Used in the json_to_netlist method.
        """
        netlist = ""
        compute_numeric = True
        for comp_id, component in components_dict.items():
            name = component["name"]
            if "valeur" in component:
                value = component["valeur"]
            else:
                compute_numeric = False
                logging.warning(f"Component '{name}' has no value specified.")
            nodes = []

            for lk_key, lk_value in link_dict.items():
                source_id = lk_value["source"]["id"]
                target_id = lk_value["target"]["id"]

                # If the link belongs to this component
                if source_id == comp_id and target_id in noeud_dict:
                    nodes.append(noeud_dict[target_id]["name"])
                elif target_id == comp_id and source_id in noeud_dict:
                    nodes.append(noeud_dict[source_id]["name"])

            # If a component doesn't have 2 or more nodes, log or raise error
            if len(nodes) < 2:
                raise ValueError(f"Component '{name}' not connected to 2 or more elements.")
            if compute_numeric:
                netlist += f"{name} {nodes[0]} {nodes[1]} {value}\n"
            else:
                netlist += f"{name} {nodes[0]} {nodes[1]}\n"

        return netlist