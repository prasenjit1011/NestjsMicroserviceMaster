# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Make the calculator scripts executable
RUN chmod +x calculator.py web_calculator.py

# Expose port 5000 for the web calculator
EXPOSE 5000

# Set the default command to run the web calculator
CMD ["python", "web_calculator.py"]

# Optional: Add labels for better container management
LABEL maintainer="your-email@example.com"
LABEL version="2.0"
LABEL description="A Python calculator with web interface and authentication"
