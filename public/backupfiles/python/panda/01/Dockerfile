# Use an official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy files
COPY requirements.txt .
COPY script.py .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the script
