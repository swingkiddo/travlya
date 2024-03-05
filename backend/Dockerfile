FROM python:3.10-alpine

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY travlya backend
WORKDIR /backend

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]