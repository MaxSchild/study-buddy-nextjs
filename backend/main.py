import asyncio
import json
from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import httpx

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS erlauben für localhost:3000 (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobApplicationInput(BaseModel):
    message: str


@app.post("/job-application/")
async def receive_job_application(data: JobApplicationInput):
    print(f"Job application received: {data.message}")
    await asyncio.sleep(5)

    suggestions = [
        {
            "title": "Frontend Developer Praktikum...",
            "companies": ["SAP", "Bosch"],
            "description": "...",
            "reason": "...",
        },
        {
            "title": "Frontend Engineer im Bereich Multimedia...",
            "companies": ["ZDF", "Netflix"],
            "description": "...",
            "reason": "...",
        },
        {
            "title": "Praktikum im Bereich Innovation...",
            "companies": ["Telekom", "Fraunhofer"],
            "description": "...",
            "reason": "...",
        },
    ]

    return {
        "message": "Thanks for your interest! Based on your input, here are some matching internships:",
        "suggestions": suggestions,
        "echo": data.message,
    }


AI_BACKEND_URL = "http://localhost:8001"  # falls im Docker auf 8001 läuft


@app.post("/getstarted/pdf-geek/")
async def proxy_pdf_geek(
    background_process: BackgroundTasks,
    metadata: str = Form(...),
    files: List[UploadFile] = File(...),
):
    try:
        form_data = httpx.MultipartWriter()
        form_data.add_part(metadata, name="metadata")

        for file in files:
            content = await file.read()
            form_data.add_part(
                content,
                filename=file.filename,
                content_type=file.content_type,
                name="files",
            )

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{AI_BACKEND_URL}/getstarted/pdf-geek/",
                content=form_data,
                headers={"Content-Type": form_data.content_type},
            )

        return response.json()

    except Exception as e:
        return {"error": f"Proxy-Fehler: {str(e)}"}
