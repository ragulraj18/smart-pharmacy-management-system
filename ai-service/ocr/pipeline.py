"""
OCR pipeline: image -> OpenCV preprocessing -> grayscale -> noise reduction ->
thresholding -> OCR -> text extraction -> possible medicine name extraction.

Requires pytesseract + the Tesseract OCR binary installed on the host.
If Tesseract is not installed, this module falls back to returning an
"unable to identify reliably" response rather than guessing.
"""
import os
import cv2
import numpy as np

try:
    import pytesseract

    # On Windows, pytesseract relies on the tesseract.exe being on PATH.
    # Terminals/IDEs opened before a PATH change won't see the update, so
    # we point pytesseract directly at the known install location as a
    # reliable fallback — this works regardless of terminal PATH state.
    WINDOWS_DEFAULT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.name == "nt" and os.path.exists(WINDOWS_DEFAULT_PATH):
        pytesseract.pytesseract.tesseract_cmd = WINDOWS_DEFAULT_PATH

    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False


def preprocess_image(image_path: str):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError('Could not read image file')

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh


def extract_text(image_path: str) -> dict:
    """Returns { text, confidence } — confidence is a rough heuristic (0-100)."""
    if not TESSERACT_AVAILABLE:
        return {'text': '', 'confidence': 0, 'error': 'OCR engine not installed on this server'}

    try:
        processed = preprocess_image(image_path)
        data = pytesseract.image_to_data(processed, output_type=pytesseract.Output.DICT)
        words = [w for w in data['text'] if w.strip()]
        confidences = [int(c) for c in data['conf'] if c not in ('-1', -1)]
        avg_conf = sum(confidences) / len(confidences) if confidences else 0
        return {'text': ' '.join(words), 'confidence': round(avg_conf, 1)}
    except Exception as e:
        return {'text': '', 'confidence': 0, 'error': str(e)}