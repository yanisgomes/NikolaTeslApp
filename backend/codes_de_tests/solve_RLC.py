from sympy import symbols, Eq, solve, I
from sympy.physics.control.lti import TransferFunction


# Définir les variables
e, uL, uC, s, u, L, omega, i, C, R = symbols('e uL uC s u L omega i C R')
j = I  # Définir j comme unité imaginaire (I)

# Définir les équations
eq1 = Eq(e, uL + uC + s)
eq2 = Eq(uL, j * L * omega * i)
eq3 = Eq(i, C * j * omega * uC)
eq4 = Eq(s, R * i)

# Résoudre le système pour obtenir s en fonction de e
solutions = solve((eq1, eq2, eq3, eq4), (s, e, uL, uC)) # Solve the system to get s, e, uL and uC in terms of i

print("solutions : ", solutions)

# Extraire l'expression de s/e
s_over_e = solutions[s] / solutions[e]
s_over_e_simplified = s_over_e.simplify()


# Separate numerator and denominator of the transfer function
numerator, denominator = s_over_e_simplified.as_numer_denom()

# Create the TransferFunction object
tf_canonical = TransferFunction(numerator, denominator, s)
tf_canonical = tf_canonical.simplify()

print("simplified form of the TF : ", tf_canonical)