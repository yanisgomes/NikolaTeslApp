"""
simulator.py

This module contains the Simulator class which handles the numerical simulation of the circuit.
Conversely to solver.py which contains the symbolic manipulation of the circuit equations, this module uses scipy to simulate the circuit and get the step and frequency responses.
It builds upon the Circuit class and the equations obtained from the Solver class.
The solver class has a getNumericalTransferFunction which is used by the Simulator class to get the numerical transfer function of the circuit.
"""

import logging 
from scipy.signal import TransferFunction, bode, step, lti
import numpy as np

class Simulator:
    """
    Handles the numerical simulation of the circuit.

    Attributes:
        circuit (Circuit): The circuit instance associated with the simulator.
        num (list): The numerator coefficients of the transfer function.
        denom (list): The denominator coefficients of the transfer function.
    """
    def __init__(self, circuit, num, denom):
        self.circuit = circuit  
        self.num, self.denom = num, denom
        self.sys = lti(self.num, self.denom) # create a scipy linear time invariant system

    def getStepResponse(self):
        """
        Get the step response of the circuit.

        Returns:
            tuple: A tuple containing the time array, input array, and output array of the step response.

        Raises:
            Exception: If an error occurs during getting the step response.
        """
        try:
            logging.info("Starting to get step response.")
            t, y = step(self.sys)
            x = np.ones(len(t))
            # Insert t=0, y=0 and x=0 to have plotting beginning at zero
            t = np.insert(t, 0, 0)
            y = np.insert(y, 0, 0)
            x = np.insert(x, 0, 0)
            logging.info("Finished getting step response.")
            return t, x, y
        except Exception as e:
            logging.error(f"Error getting step response: {e}")
            raise

    def getFrequencyResponse(self):
        """
        Get the frequency response of the circuit.

        Returns:
            tuple: A tuple containing the frequency array, magnitude array, and phase array of the frequency response.

        Raises:
            Exception: If an error occurs during getting the frequency response.
        """
        try:
            logging.info("Starting to get frequency response.")
            w, mag, phase = bode(self.sys)
            logging.info("Finished getting frequency response.")
            return w, mag, phase
        except Exception as e:
            logging.error(f"Error getting frequency response: {e}")
            raise

