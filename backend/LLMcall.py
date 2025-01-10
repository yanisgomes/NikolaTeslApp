"""
LLMcall.py

This module contains the functions to build a prompt for querying the LLM and to query the LLM with the prompt.
"""

import sympy
import os
from dotenv import load_dotenv
import logging
import requests


load_dotenv()
api_key = os.getenv('OPENROUTER_API_KEY')

def build_prompt(netlist, solutions, transferFunction, equations):
    """
    Build a prompt string for querying the LLM.

    Args:
        netlist (str): The netlist string representing the circuit.
        solutions (dict): The dictionary of solutions for the variables in the circuit.
        transferFunction (sympy.Expr): The transfer function of the circuit.
        equations (list): The list of Sympy equations representing the circuit.

    Returns:
        str: The prompt string for querying the LLM.
    """
    prompt = f"Voici la netlist d'un circuit d'électornique \n --- {netlist} \n ---Les équations sont \n ---"
    for equ,expl in equations:
        prompt+= str((f"{expl} : {sympy.latex(equ)}")) + "\n"
    prompt += "Voici les résultats de la résolution \n ---"
    for sol in solutions:
        prompt += str(f"{sympy.latex(sol)} = {sympy.latex(solutions[sol])}") + "\n"
    prompt += " --- Voici la fonction de transfert du circuit \n ---"
    prompt += str(f"Transfer Function: {sympy.latex(transferFunction)}") + "\n"
    prompt += " --- Si tu reconnais le circuit étudié, donne en une explication en une phrase et donne (latex) les paramètres les plus importants. Sinon dit que tu ne reconnais pas le circuit. Ne t'exprime pas avec 'je'"
    return prompt


def query_LLM(prompt):
    """
    Query the LLM with the given prompt.

    Args:
        prompt (str): The prompt string for querying the LLM.

    Returns:
        str: The response from the LLM.

    Raises:
        ValueError: If the API key is missing or an error occurs during the API request.
    """
    if not api_key:
        logging.warning("API key is missing.")
        raise ValueError("Error: API key is missing.")
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    url = 'https://openrouter.ai/api/v1/completions'
    data = {
        'model': 'gpt-3.5-turbo',  # Replace with your model
        'prompt': prompt,
        'max_tokens': 150
    }
    try:
        logging.info("Starting API request to OpenRouter.")
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raise an HTTPError if the response was unsuccessful
        response_json = response.json()
        if 'choices' not in response_json:
            logging.error("Error: 'choices' not found in response")
            raise ValueError("Error: 'choices' not found in response")
        logging.info("Finished API request to OpenRouter.")
        return response_json['choices'][0]['text']
    except requests.exceptions.RequestException as e:
        logging.error(f"An error occurred during the API request: {e}")
        raise ValueError(f"An error occurred during the API request: {e}")