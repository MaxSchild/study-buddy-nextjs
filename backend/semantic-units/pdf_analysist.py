import os
import sys
# Add parent directory to path to allow imports from there
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from form_recognition import process_upload

from dotenv import load_dotenv
load_dotenv()

FILE_NAME = "cv_bsc_2019_po.pdf"

process_upload([FILE_NAME])