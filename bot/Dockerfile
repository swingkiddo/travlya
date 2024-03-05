FROM python:3.10-alpine

WORKDIR /bot

COPY requirements.txt .
RUN pip install -r requirements.txt


COPY config.py .
COPY main.py .

CMD ["python", "main.py"]