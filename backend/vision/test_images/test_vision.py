import json
import os
import sys
from pathlib import Path


# ============================================================
# ADD PROJECT ROOT TO PYTHON PATH
# ============================================================

TEST_DIR = Path(__file__).resolve().parent

PROJECT_ROOT = TEST_DIR.parent.parent

sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# IMPORT VISION SERVICE
# ============================================================

from vision.vision_service import analyze_project_images


# ============================================================
# IMAGE PATHS
# ============================================================

REFERENCE_IMAGE = TEST_DIR / "reference.png"
CURRENT_IMAGE = TEST_DIR / "current.png"


# ============================================================
# API KEY
# ============================================================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is not set."
    )


# ============================================================
# CHECK FILES
# ============================================================

if not REFERENCE_IMAGE.exists():
    raise FileNotFoundError(
        f"Reference image not found: {REFERENCE_IMAGE}"
    )

if not CURRENT_IMAGE.exists():
    raise FileNotFoundError(
        f"Current image not found: {CURRENT_IMAGE}"
    )


# ============================================================
# RUN VISION ANALYSIS
# ============================================================

print("========================================")
print("PRAGATI AI - VISION TEST")
print("========================================")

print(
    f"Reference image: {REFERENCE_IMAGE}"
)

print(
    f"Current image:   {CURRENT_IMAGE}"
)

print("\nStarting vision analysis...")
print("Sending both images to Gemini...\n")


result = analyze_project_images(
    reference_image_path=str(REFERENCE_IMAGE),
    current_image_path=str(CURRENT_IMAGE),
    api_key=api_key,
)


# ============================================================
# DISPLAY RESULT
# ============================================================

print("========================================")
print("VISION ANALYSIS RESULT")
print("========================================\n")

print(
    json.dumps(
        result,
        indent=2,
        ensure_ascii=False
    )
)