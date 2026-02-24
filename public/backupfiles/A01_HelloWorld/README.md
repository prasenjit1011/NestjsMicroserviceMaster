# Hello World Python Project

A simple Python project that demonstrates the classic "Hello, World!" program.

## Description

This project contains a basic Python script that prints "Hello, World!" to the console. It's designed as an introductory example for Python programming.

## Files

- `hello_world.py` - The main Python script
- `README.md` - This file

## How to Run

### Option 1: Run with Python directly

1. Make sure you have Python installed on your system
2. Open a terminal/command prompt
3. Navigate to the project directory
4. Run the script:
   ```bash
   python hello_world.py
   ```

### Option 2: Run with Docker

1. Make sure you have Docker installed on your system
2. Open a terminal/command prompt
3. Navigate to the project directory
4. Build the Docker image:
   ```bash
   docker build -t hello-world-python .
   ```
5. Run the Docker container:
   ```bash
   docker run hello-world-python
   ```

## Expected Output

```
Hello, World!
Welcome to Python programming!
```

## Requirements

- Python 3.x (for direct execution)
- Docker (for containerized execution)

## Project Creation Prompts

This project was created using the following prompts with GitHub Copilot:

1. **Initial Request**: "create "Hello World" project in python"
   - Created the basic Python script (`hello_world.py`)
   - Added project documentation (`README.md`)
   - Created `.gitignore` for Python projects

2. **Docker Integration**: "run the project with docker"
   - Added `Dockerfile` for containerization
   - Created `.dockerignore` file
   - Updated README with Docker instructions
   - Built and tested the Docker container

## Author

Created as a learning project for Python programming basics using GitHub Copilot assistance.
