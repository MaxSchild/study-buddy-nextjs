import json
import os
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List
from form_recognition import process_upload

app = FastAPI()
UPLOAD_DIR = "tmp"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/getstarted/pdf-geek/")
async def pdf_receive(
    background_process: BackgroundTasks,
    metadata: str = Form(...),
    files: List[UploadFile] = File(...),
):
    try:
        metadata_dict = json.loads(metadata)
        filenames = metadata_dict.get("filenames", [])

        if len(filenames) != len(files):
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Anzahl der Dateinamen stimmt nicht mit der Anzahl der Dateien überein."
                },
            )

        saved_files = []

        for i, file in enumerate(files):
            if file.content_type != "application/pdf":
                return JSONResponse(
                    status_code=400,
                    content={"error": f"{file.filename} ist keine PDF-Datei."},
                )

            new_filename = filenames[i]
            file_path = os.path.join(UPLOAD_DIR, new_filename)

            with open(file_path, "wb") as f:
                f.write(await file.read())

            saved_files.append(new_filename)

        background_process.add_task(process_upload, saved_files)
        return {"message": "Upload erfolgreich!", "saved_files": saved_files}

    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400, content={"error": "Ungültiges JSON im Feld 'metadata'."}
        )
