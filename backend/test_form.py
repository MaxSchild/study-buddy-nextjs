from form_recognition import process_upload

from dotenv import load_dotenv
load_dotenv()

process_upload(["cv_bsc_2019_po.pdf"])

# filenames = ["cv_bsc_2019_po.pdf"]
# process_upload(filenames)

# deployment_name = "gpt