"""
Explanation Engine service for generating human-readable reasoning and reports
for risk analysis decisions.
"""


def generate_explanation(risk_factors: list[str]) -> str:
    """Combines risk factors into a cohesive explanatory narrative."""
    if not risk_factors:
        return "No specific risk factors were identified for this project."

    return "Risk factors identified: " + "; ".join(risk_factors) + "."

