import os

from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

from dotenv import load_dotenv

load_dotenv()

key = os.getenv("AZURE_FORM_RECOGNIZER_API_KEY")
# key = os.environ(AZURE_FORM_RECOGNIZER_API_KEY)
endpoint = os.getenv("AZURE_FORM_RECOGNIZER_ENDPOINT")

credential = AzureKeyCredential(key)

client = DocumentAnalysisClient(endpoint=endpoint, credential=credential)
UPLOAD_DIR = "tmp"


def process_upload(filenames):
    # eximnation regulation
    # curriculum
    for name in filenames:
        file_path = os.path.join(UPLOAD_DIR, name)
        with open(file_path, "rb") as f:
            poller = client.begin_analyze_document(
                model_id="prebuilt-layout",
                document=f,
            )
        result = poller.result()

        extract_file_path = os.path.join(UPLOAD_DIR, f"{name}.extract")
        with open(extract_file_path, "w") as f:
            for page in result.pages:
                for line in page.lines:
                    f.write(f"{line.content}\n")
