"""
Demand forecasting using historical sales data.

NOTE: This is a lightweight linear-regression baseline meant to demonstrate
the pipeline (features -> model -> prediction). For a real deployment, train
on actual sales history exported from MongoDB (medicine, date, quantity
sold, price, month, day-of-week, season) and persist the trained model with
joblib instead of fitting on the fly.
"""
from sklearn.linear_model import LinearRegression
import numpy as np


def forecast_demand(historical_quantities: list, current_stock: int) -> dict:
    """
    historical_quantities: past periods of units sold, oldest first.
    Returns a predicted demand estimate and a reorder recommendation.
    Always clearly labelled as an ESTIMATE — never presented as certain.
    """
    if len(historical_quantities) < 3:
        # Not enough history for a meaningful model — use a simple average instead
        if historical_quantities:
            predicted = round(sum(historical_quantities) / len(historical_quantities))
        else:
            predicted = 10
    else:
        X = np.arange(len(historical_quantities)).reshape(-1, 1)
        y = np.array(historical_quantities)
        model = LinearRegression()
        model.fit(X, y)
        next_period = np.array([[len(historical_quantities)]])
        predicted = max(0, round(float(model.predict(next_period)[0])))

    recommendation = 'Reorder Recommended' if predicted > current_stock else 'Stock Sufficient'

    return {
        'currentStock': current_stock,
        'predictedDemand': predicted,
        'recommendation': recommendation,
        'note': 'This is an estimate based on historical trends, not a guarantee.',
    }