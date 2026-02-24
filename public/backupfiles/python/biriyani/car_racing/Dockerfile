# Use official Python image

FROM python:3.11-slim

# Install OpenGL libraries for Panda3D (Debian trixie)
RUN apt-get update && apt-get install -y libgl1-mesa-dri libgl1-mesa-dev libglu1-mesa && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
