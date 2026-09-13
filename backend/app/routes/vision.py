from pathlib import Path
import sys
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile

PROJECT_ROOT = Path(__file__).resolve().parents[3]
VISION_ROOT = PROJECT_ROOT / "vision"

if str(VISION_ROOT) not in sys.path:
    sys.path.insert(0, str(VISION_ROOT))

from vision.vision_service import analyze_project_images


router = APIRouter(
    prefix="/api/vision",
    tags=["Vision"]
)
@router.post("/analyze")
async def analyze_vision(
    reference_image: UploadFile = File(...),
    current_image: UploadFile = File(...),
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    }

    if reference_image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid reference image format."
        )

    if current_image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid current image format."
        )

    reference_path = None
    current_path = None

    try:
        reference_bytes = await reference_image.read()
        current_bytes = await current_image.read()

        with tempfile.NamedTemporaryFile(
            suffix=Path(reference_image.filename or "reference.png").suffix,
            delete=False
        ) as ref_file:
            ref_file.write(reference_bytes)
            reference_path = ref_file.name

        with tempfile.NamedTemporaryFile(
            suffix=Path(current_image.filename or "current.png").suffix,
            delete=False
        ) as cur_file:
            cur_file.write(current_bytes)
            current_path = cur_file.name

        result = analyze_project_images(
            reference_image_path=reference_path,
            current_image_path=current_path,
        )

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )

    finally:
        if reference_path:
            Path(reference_path).unlink(missing_ok=True)

        if current_path:
            Path(current_path).unlink(missing_ok=True)