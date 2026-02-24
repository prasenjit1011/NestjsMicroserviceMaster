#!/usr/bin/env python3
"""
Simple Calculator - Beginner Version
A basic calculator for learning Python fundamentals.
"""

def main():
    """Simple calculator that performs one operation"""
    print("=== Simple Calculator ===")
    print("This calculator will perform one operation.")
    
    # Get first number
    while True:
        try:
            num1 = float(input("Enter first number: "))
            break
        except ValueError:
            print("Please enter a valid number!")
    
    # Get operation
    print("\nSelect operation:")
    print("+ for addition")
    print("- for subtraction")
    print("* for multiplication")
    print("/ for division")
    
    operation = input("Enter operation (+, -, *, /): ").strip()
    
    # Get second number
    while True:
        try:
            num2 = float(input("Enter second number: "))
            break
        except ValueError:
            print("Please enter a valid number!")
    
    # Perform calculation
    if operation == '+':
        result = num1 + num2
        print(f"\nResult: {num1} + {num2} = {result}")
    elif operation == '-':
        result = num1 - num2
        print(f"\nResult: {num1} - {num2} = {result}")
    elif operation == '*':
        result = num1 * num2
        print(f"\nResult: {num1} * {num2} = {result}")
    elif operation == '/':
        if num2 == 0:
            print("\nError: Cannot divide by zero!")
        else:
            result = num1 / num2
            print(f"\nResult: {num1} / {num2} = {result}")
    else:
        print("\nError: Invalid operation! Please use +, -, *, or /")
    
    print("\nThank you for using the Simple Calculator!")

if __name__ == "__main__":
    main()
