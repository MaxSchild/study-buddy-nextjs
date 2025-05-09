FROM python:3.10

WORKDIR /app

COPY main.py /app/
COPY form_recognition.py /app/
COPY requirements.txt /app/
COPY .env /app/

RUN mkdir -p /app/tmp

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
