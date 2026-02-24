#!/usr/bin/env python3
"""
Web Calculator with Authentication
A Flask-based web calculator with login functionality
"""

from flask import Flask, render_template, request, redirect, url_for, session, flash
import hashlib
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'  # Change this in production!

# In-memory user database (in production, use a real database)
USERS = {
    'admin': {
        'password_hash': '482c811da5d5b4bc6d497ffa98491e38',  # password123
        'name': 'Administrator'
    },
    'user': {
        'password_hash': 'ee11cbb19052e40b07aac0ca060c23ee',  # user123
        'name': 'User'
    }
}

class Calculator:
    """Calculator class with basic arithmetic operations."""
    
    def add(self, a, b):
        """Add two numbers."""
        return a + b
    
    def subtract(self, a, b):
        """Subtract second number from first."""
        return a - b
    
    def multiply(self, a, b):
        """Multiply two numbers."""
        return a * b
    
    def divide(self, a, b):
        """Divide first number by second."""
        if b == 0:
            raise ValueError("Cannot divide by zero!")
        return a / b
    
    def modulo(self, a, b):
        """Get remainder of division."""
        if b == 0:
            raise ValueError("Cannot divide by zero!")
        return a % b
    
    def power(self, a, b):
        """Raise first number to the power of second."""
        return a ** b


def hash_password(password):
    """Hash a password using MD5 (not recommended for production)."""
    return hashlib.md5(password.encode()).hexdigest()


def verify_password(username, password):
    """Verify username and password."""
    if username in USERS:
        password_hash = hash_password(password)
        return USERS[username]['password_hash'] == password_hash
    return False


def require_login(f):
    """Decorator to require login for protected routes."""
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function


@app.route('/')
def index():
    """Redirect to login or calculator based on session."""
    if 'username' in session:
        return redirect(url_for('calculator'))
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login."""
    if request.method == 'POST':
        username = request.form['username'].strip()
        password = request.form['password']
        
        if not username or not password:
            return render_template('login.html', error='Please enter both username and password.')
        
        if verify_password(username, password):
            session['username'] = username
            session['name'] = USERS[username]['name']
            session['login_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            return redirect(url_for('calculator'))
        else:
            return render_template('login.html', error='Invalid username or password.')
    
    return render_template('login.html')


@app.route('/logout')
def logout():
    """Handle user logout."""
    session.clear()
    return redirect(url_for('login'))


@app.route('/calculator', methods=['GET', 'POST'])
@require_login
def calculator():
    """Main calculator page."""
    calc = Calculator()
    result = None
    error = None
    operation_display = None
    
    if request.method == 'POST':
        try:
            num1 = float(request.form['num1'])
            num2 = float(request.form['num2'])
            operation = request.form['operation']
            
            if operation == 'add':
                result = calc.add(num1, num2)
                operation_display = f"{num1} + {num2}"
            elif operation == 'subtract':
                result = calc.subtract(num1, num2)
                operation_display = f"{num1} - {num2}"
            elif operation == 'multiply':
                result = calc.multiply(num1, num2)
                operation_display = f"{num1} × {num2}"
            elif operation == 'divide':
                result = calc.divide(num1, num2)
                operation_display = f"{num1} ÷ {num2}"
            elif operation == 'modulo':
                result = calc.modulo(num1, num2)
                operation_display = f"{num1} % {num2}"
            elif operation == 'power':
                result = calc.power(num1, num2)
                operation_display = f"{num1} ^ {num2}"
            else:
                error = "Please select a valid operation."
                
        except ValueError as e:
            error = str(e)
        except Exception as e:
            error = f"An error occurred: {str(e)}"
    
    return render_template('calculator.html', 
                         username=session['username'],
                         result=result, 
                         error=error, 
                         operation_display=operation_display)


@app.route('/calculate', methods=['POST'])
@require_login
def calculate():
    """Handle calculation requests."""
    return calculator()


@app.route('/ui_calculator')
@require_login
def ui_calculator():
    """Modern UI calculator page."""
    return render_template('ui_calculator.html', username=session['username'])


if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    
    print("=== Web Calculator with Authentication ===")
    print("Demo Credentials:")
    print("Username: admin, Password: password123")
    print("Username: user, Password: user123")
    print("==========================================")
    print("Starting server at http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
