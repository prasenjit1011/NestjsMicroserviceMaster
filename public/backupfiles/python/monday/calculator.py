#!/usr/bin/env python3
"""
Simple Calculator Application
Supports basic arithmetic operations: +, -, *, /, %, **
"""

import sys


class Calculator:
    """A simple calculator class with basic arithmetic operations."""
    
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


def get_numbers():
    """Get two numbers from user input."""
    try:
        num1 = float(input("Enter first number: "))
        num2 = float(input("Enter second number: "))
        return num1, num2
    except ValueError:
        print("Error: Please enter valid numbers!")
        return None, None


def display_menu():
    """Display the calculator menu."""
    print("\n" + "="*40)
    print("         PYTHON CALCULATOR")
    print("="*40)
    print("1. Addition (+)")
    print("2. Subtraction (-)")
    print("3. Multiplication (*)")
    print("4. Division (/)")
    print("5. Modulo (%)")
    print("6. Power (**)")
    print("7. Exit")
    print("-"*40)


def main():
    """Main calculator loop."""
    calc = Calculator()
    
    print("Welcome to the Python Calculator!")
    
    while True:
        display_menu()
        
        try:
            choice = input("Enter your choice (1-7): ").strip()
            
            if choice == '7':
                print("Thank you for using the calculator. Goodbye!")
                sys.exit(0)
            
            if choice not in ['1', '2', '3', '4', '5', '6']:
                print("Error: Invalid choice! Please select 1-7.")
                continue
            
            num1, num2 = get_numbers()
            if num1 is None or num2 is None:
                continue
            
            try:
                if choice == '1':
                    result = calc.add(num1, num2)
                    operation = f"{num1} + {num2}"
                elif choice == '2':
                    result = calc.subtract(num1, num2)
                    operation = f"{num1} - {num2}"
                elif choice == '3':
                    result = calc.multiply(num1, num2)
                    operation = f"{num1} * {num2}"
                elif choice == '4':
                    result = calc.divide(num1, num2)
                    operation = f"{num1} / {num2}"
                elif choice == '5':
                    result = calc.modulo(num1, num2)
                    operation = f"{num1} % {num2}"
                elif choice == '6':
                    result = calc.power(num1, num2)
                    operation = f"{num1} ** {num2}"
                
                print(f"\nResult: {operation} = {result}")
                
            except ValueError as e:
                print(f"Error: {e}")
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
        
        except KeyboardInterrupt:
            print("\n\nCalculator interrupted. Goodbye!")
            sys.exit(0)
        except Exception as e:
            print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
