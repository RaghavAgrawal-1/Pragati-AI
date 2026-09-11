
import os
import joblib
import numpy as np
import pandas as pd


# ---------------------------------------------------------
# MODEL PATHS
# ---------------------------------------------------------

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "models"
)

COST_CLASSIFIER_PATH = os.path.join(
    MODEL_DIR,
    "cost_overrun_classifier.joblib"
)

COST_REGRESSOR_PATH = os.path.join(
    MODEL_DIR,
    "cost_overrun_regressor.joblib"
)

TIME_CLASSIFIER_PATH = os.path.join(
    MODEL_DIR,
    "time_overrun_classifier.joblib"
)


# ---------------------------------------------------------
# LOAD MODELS
# ---------------------------------------------------------

cost_classifier = joblib.load(
    COST_CLASSIFIER_PATH
)

cost_regressor = joblib.load(
    COST_REGRESSOR_PATH
)

time_classifier = joblib.load(
    TIME_CLASSIFIER_PATH
)


# ---------------------------------------------------------
# COST FEATURE ENGINEERING
# ---------------------------------------------------------

def create_cost_features(data):
    data = data.copy()

    data["log_approved_cost"] = np.log1p(
        data["approved_cost_cr"].clip(lower=0)
    )

    data["milestone_completion_ratio"] = (
        data["milestones_completed"]
        /
        data["milestones_total"].replace(0, np.nan)
    ).fillna(0).clip(0, 1)

    data["remaining_progress_pct"] = (
        100 - data["physical_progress_pct"]
    ).clip(0, 100)

    return data


# ---------------------------------------------------------
# TIME FEATURE ENGINEERING
# ---------------------------------------------------------

def create_time_features(data):
    data = data.copy()

    data["start_date"] = pd.to_datetime(
        data["start_date"]
    )

    data["original_completion_date"] = pd.to_datetime(
        data["original_completion_date"]
    )

    data["planned_duration_months"] = (
        data["planned_duration_days"] / 30.44
    )

    today = pd.Timestamp.today()

    data["elapsed_days"] = (
        today - data["start_date"]
    ).dt.days.clip(lower=0)

    data["elapsed_duration_ratio"] = (
        data["elapsed_days"]
        /
        data["planned_duration_days"].replace(
            0, np.nan
        )
    ).fillna(0).clip(lower=0)

    data["remaining_planned_days"] = (
        data["planned_duration_days"]
        -
        data["elapsed_days"]
    ).clip(lower=0)

    data["milestone_completion_ratio"] = (
        data["milestones_completed"]
        /
        data["milestones_total"].replace(
            0, np.nan
        )
    ).fillna(0).clip(0, 1)

    data["remaining_progress_pct"] = (
        100 - data["physical_progress_pct"]
    ).clip(0, 100)

    return data


# ---------------------------------------------------------
# MODEL FEATURES
# ---------------------------------------------------------

COST_FEATURES = [
    "sector",
    "line_ministry",
    "project_type",
    "implementing_agency",
    "location",
    "status",
    "approved_cost_cr",
    "log_approved_cost",
    "physical_progress_pct",
    "remaining_progress_pct",
    "milestones_total",
    "milestones_completed",
    "milestone_completion_ratio",
    "planned_duration_days"
]


TIME_FEATURES = [
    "sector",
    "line_ministry",
    "project_type",
    "implementing_agency",
    "location",
    "approved_cost_cr",
    "physical_progress_pct",
    "milestones_total",
    "milestones_completed",
    "planned_duration_days",
    "planned_duration_months",
    "elapsed_duration_ratio",
    "remaining_planned_days",
    "milestone_completion_ratio",
    "remaining_progress_pct"
]


# ---------------------------------------------------------
# MAIN PREDICTION FUNCTION
# ---------------------------------------------------------

def predict_project_risk(project_data):
    """
    Generate ML predictions for a single project.

    Returns:
        cost overrun probability
        cost overrun prediction
        estimated cost overrun percentage
        time overrun probability
        time overrun prediction
    """

    project_df = pd.DataFrame(
        [project_data]
    )

    # -------------------------------
    # COST FEATURES
    # -------------------------------

    cost_data = create_cost_features(
        project_df
    )

    cost_probability = cost_classifier.predict_proba(
        cost_data[COST_FEATURES]
    )[0, 1]

    cost_prediction = int(
        cost_classifier.predict(
            cost_data[COST_FEATURES]
        )[0]
    )

    # -------------------------------
    # COST MAGNITUDE
    # -------------------------------

    if cost_prediction == 1:

        predicted_log_overrun = (
            cost_regressor.predict(
                cost_data[COST_FEATURES]
            )[0]
        )

        predicted_overrun_pct = max(
            0,
            float(
                np.expm1(
                    predicted_log_overrun
                )
            )
        )

    else:
        predicted_overrun_pct = 0.0

    # -------------------------------
    # TIME FEATURES
    # -------------------------------

    time_data = create_time_features(
        project_df
    )

    time_probability = (
        time_classifier.predict_proba(
            time_data[TIME_FEATURES]
        )[0, 1]
    )

    time_prediction = int(
        time_classifier.predict(
            time_data[TIME_FEATURES]
        )[0]
    )

    # -------------------------------
    # RETURN RESULT
    # -------------------------------

    return {
        "cost_overrun_probability": round(
            float(cost_probability),
            4
        ),

        "cost_overrun_prediction": cost_prediction,

        "estimated_cost_overrun_pct": round(
            predicted_overrun_pct,
            2
        ),

        "time_overrun_probability": round(
            float(time_probability),
            4
        ),

        "time_overrun_prediction": time_prediction
    }
