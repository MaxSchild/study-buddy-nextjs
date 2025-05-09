# curl -X POST "http://localhost:5000/getstarted/pdf-geek/"     -H "Content-Type: multipart/form-data"     -F 'metadata={"filenames":["document1.pdf","document2.pdf"]}'     -F "files=@data/cv_bsc_2019_curriculum.pdf"     -F "files=@data/cv_bsc_2019_po.pdf"

#!/usr/bin/env python3
import requests
import json
import sys
from pathlib import Path

def main():
    url = "http://localhost:8000/getstarted/pdf-geek"
    # Adjust these paths / filenames as needed
    files_to_send = [
        Path("data/cv_bsc_2019_curriculum.pdf"),
        Path("data/cv_bsc_2019_po.pdf"),
    ]

    # Build metadata based on filenames
    metadata = {"filenames": [f.name for f in files_to_send]}

    # Prepare the multipart payload
    files = [
        ("files", (f.name, f.open("rb"), "application/pdf"))
        for f in files_to_send
    ]
    data = {"metadata": json.dumps(metadata)}
    print(metadata)

    # Send the request
    try:
        resp = requests.post(url, files=files, data=data)
        resp.raise_for_status()
    except requests.RequestException as e:
        print("Request failed:", e, file=sys.stderr)
        sys.exit(1)

    print(f"Status: {resp.status_code}")
    print("Response body:")
    print(resp.text)

if __name__ == "__main__":
    main()
