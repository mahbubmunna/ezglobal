import os
import json
import pdfplumber
import pytesseract
from PIL import Image
from datetime import datetime
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.models.applications import Document

RULES_PATH = os.path.join(os.path.dirname(__file__), "document_rules.json")
try:
    with open(RULES_PATH, 'r') as f:
        DOCUMENT_RULES = json.load(f)
except Exception:
    DOCUMENT_RULES = {}

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error extracting PDF from {file_path}: {e}")
    return text.strip()

def extract_text_from_image(file_path: str) -> str:
    try:
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        print(f"Error extracting OCR from {file_path}: {e}")
        return ""

def detect_document_type(filename: str, raw_text: str) -> str:
    search_space = f"{filename} {raw_text}".lower()
    
    for doc_type, rule in DOCUMENT_RULES.items():
        if "keywords" in rule:
            for kw in rule["keywords"]:
                if kw.lower() in search_space:
                    return doc_type
    
    return "Unknown Document"

async def process_document(session: AsyncSession, document: Document) -> Document:
    if not document.file_path or not os.path.exists(document.file_path):
        document.review_status = "needs_fix"
        document.raw_text = ""
        document.processed_at = datetime.utcnow()
        session.add(document)
        await session.commit()
        await session.refresh(document)
        return document

    ext = os.path.splitext(document.file_path)[1].lower()
    
    raw_text = ""
    if ext == ".pdf":
        raw_text = extract_text_from_pdf(document.file_path)
    elif ext in [".jpg", ".jpeg", ".png"]:
        raw_text = extract_text_from_image(document.file_path)
        
    detected_type = detect_document_type(os.path.basename(document.file_path), raw_text)
    
    document.raw_text = raw_text
    document.document_type_detected = detected_type
    document.review_status = "processed"
    document.processed_at = datetime.utcnow()
    
    session.add(document)
    await session.commit()
    await session.refresh(document)
    
    return document
