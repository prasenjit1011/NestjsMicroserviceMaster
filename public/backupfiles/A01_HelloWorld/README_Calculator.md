# Basic Calculator Python Project

A simple calculator application that performs basic arithmetic operations (addition, subtraction, multiplication, and division).

## Description

This project demonstrates fundamental Python concepts including:
- **Variables**: Storing numbers and operation results
- **User Input**: Getting numbers and menu choices from the user
- **Arithmetic Operations**: Basic math operations (+, -, *, /)
- **Type Conversion**: Converting string input to numbers
- **Functions**: Modular code organization
- **Error Handling**: Managing division by zero and invalid input
- **Loops**: Continuous program execution until user exits
- **Conditionals**: Menu selection and input validation

## Files

- `calculator.py` - The main calculator application
- `calculator_simple.py` - A simplified version for beginners
- `README_Calculator.md` - This file

## Features

### Main Calculator (`calculator.py`)
- Interactive menu-driven interface
- Input validation and error handling
- Continuous operation until user chooses to exit
- Clean, formatted output
- Division by zero protection

### Simple Calculator (`calculator_simple.py`)
- Basic single-operation calculator
- Minimal code for learning fundamentals
- Good starting point for beginners

## How to Run

### Option 1: Run the Full Calculator
```bash
python calculator.py
```

### Option 2: Run the Simple Calculator
```bash
python calculator_simple.py
```

### Option 3: Run with Docker
```bash
# Build the image
docker build -t basic-calculator .

# Run the calculator
docker run -it basic-calculator
```

## Sample Usage

```
Welcome to the Basic Calculator!

========================================
           BASIC CALCULATOR
========================================
Select operation:
1. Add (+)
2. Subtract (-)
3. Multiply (*)
4. Divide (/)
5. Exit
========================================
Enter choice (1-5): 1
Enter first number: 15
Enter second number: 25

Result: 15.0 + 25.0 = 40.0

Would you like to perform another calculation? (y/n): n

Thank you for using the Basic Calculator!
Goodbye!
```

## Learning Objectives

After completing this project, students will understand:
1. How to get user input and convert data types
2. How to create and use functions
3. How to implement error handling
4. How to create interactive menus
5. How to use conditional statements and loops
6. Basic arithmetic operations in Python

## Next Steps

This project builds on the Hello World concepts and prepares you for:
- Project 3: To-Do List (introducing data structures like lists)
- Project 4: Number Guessing Game (introducing random numbers)
- More complex user interactions and data handling

## Requirements

- Python 3.x
- Docker (optional, for containerized execution)

## Project Creation Prompts

This Basic Calculator project was created using the following prompts with GitHub Copilot:

1. **Initial Request**: "create Basic Calculator project"
   - Created the main calculator application (`calculator.py`) with full menu system
   - Added a simplified version for beginners (`calculator_simple.py`)
   - Created comprehensive documentation (`README_Calculator.md`)
   - Added Docker support (`Dockerfile_Calculator`)

2. **Docker Execution**: "run using docker"
   - Built the Docker image using the calculator-specific Dockerfile
   - Ran the calculator in interactive Docker container
   - Tested addition and subtraction operations successfully
   - Demonstrated containerized execution with user input

## Project Creation

This project was created as part of a Python learning roadmap, following the Basic Calculator project specification using GitHub Copilot assistance.
