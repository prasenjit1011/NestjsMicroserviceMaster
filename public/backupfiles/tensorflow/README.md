
# TensorFlow Hello World

This is a simple TensorFlow "Hello World" project for Python.

## How to run (locally)

1. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
2. Run the main script:
   ```powershell
   python main.py
   ```

## How to run (with Docker)

1. Build the Docker image:
   ```powershell
   cd c:\myprojects\github\python\tensorflow
   docker build -t tensorflow-hello .
   ```
2. Run the container:
   ```powershell
   docker run --rm tensorflow-hello
   ```

This will print:
- "Hello, TensorFlow!"
- "Hello World from TensorFlow!" (from TensorFlow operation)

## Files
- `main.py`: Main script with TensorFlow Hello World example
- `requirements.txt`: Python dependencies
- `Dockerfile`: Docker configuration for containerized run
