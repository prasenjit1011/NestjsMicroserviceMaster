FROM python:3.10

# Install dependencies
RUN apt-get update && \
    apt-get install -y python3-tk x11-apps && \
    rm -rf /var/lib/apt/lists/*

# Set display environment variable
ENV DISPLAY=:0

# Copy the script
COPY fibonacci_ball.py /app/fibonacci_ball.py
WORKDIR /app

CMD ["python", "fibonacci_ball.py"]
