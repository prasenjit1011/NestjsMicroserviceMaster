# Python Flask Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY app/ /app/
RUN pip install flask flask-login
EXPOSE 5000
CMD ["python", "app.py"]
