# Python Calculator with Docker & Web Interface

A calculator application with both command-line and web interfaces, featuring user authentication and containerized with Docker.

## Features

### Calculator Operations
- **Basic Arithmetic Operations:**
  - Addition (+)
  - Subtraction (-)
  - Multiplication (*)
  - Division (/)
  - Modulo (%)
  - Power (**)

### Web Interface Features
- **User Authentication:**
  - Username/password login system
  - Session management
  - Protected routes
  - Secure logout

- **Modern Web UI:**
  - Responsive design
  - Beautiful gradient styling
  - Form validation
  - Real-time results

### Error Handling
- Division by zero protection
- Invalid input validation
- Graceful error messages
- User-friendly feedback

## Prerequisites

- Python 3.11+ (for local running)
- Docker (for containerized deployment)

## Running Locally

1. **Clone or download the project files**
2. **Run the calculator:**
   ```bash
   python calculator.py
   ```

## Running with Docker

### Web Calculator (Recommended)

1. **Build and run the web calculator:**
   ```bash
   docker build -t python-calculator .
   docker run -p 5000:5000 python-calculator
   ```

2. **Or use Docker Compose:**
   ```bash
   docker-compose up
   ```

3. **Access the web calculator:**
   Open your browser and go to: `http://localhost:5000`

### Console Calculator

1. **Run the console version:**
   ```bash
   docker run -it --rm python-calculator python calculator.py
   ```

2. **Or with Docker Compose:**
   ```bash
   docker-compose --profile console run console-calculator
   ```

## Usage

### Web Calculator
1. **Start the web application** (see Docker instructions above)
2. **Open your browser** and navigate to `http://localhost:5000`
3. **Login with demo credentials:**
   - Username: `admin`, Password: `password123`
   - Username: `user`, Password: `user123`
4. **Use the calculator** by entering numbers and selecting operations
5. **Logout** when finished

### Console Calculator
1. **Start the console application**
2. **Choose an operation** from the menu (1-7)
3. **Enter two numbers** when prompted
4. **View the result**
5. **Continue with more calculations** or exit (option 7)

### Demo Credentials
The web calculator includes demo users:
- **Administrator:** username `admin`, password `password123`
- **Regular User:** username `user`, password `user123`

## Project Structure

```
.
├── calculator.py           # Console calculator application
├── web_calculator.py       # Web calculator with Flask
├── templates/
│   ├── login.html         # Login page template
│   └── calculator.html    # Calculator page template
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── requirements.txt      # Python dependencies
├── .gitignore           # Git ignore file
├── .dockerignore        # Docker ignore file
└── README.md           # This file
```

## Docker Details

- **Base Image:** python:3.11-slim
- **Working Directory:** /app
- **Exposed Ports:** None (console application)
- **Entry Point:** python calculator.py

## Error Handling

The calculator includes comprehensive error handling for:
- Invalid menu selections
- Non-numeric input
- Division by zero
- Keyboard interrupts (Ctrl+C)
- Unexpected errors

## Extending the Calculator

To add more features:

1. **Add new methods** to the `Calculator` class
2. **Update the menu** in `display_menu()`
3. **Add new choice handling** in `main()`
4. **Update dependencies** in `requirements.txt` if needed
5. **Rebuild the Docker image**

## License

This project is open source and available under the MIT License.
