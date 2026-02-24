#!/usr/bin/env python3
"""
Basic Calculator Python Project
A simple calculator that performs basic arithmetic operations.
"""

def add(x, y):
    """Add two numbers"""
    return x + y

def subtract(x, y):
    """Subtract second number from first"""
    return x - y

def multiply(x, y):
    """Multiply two numbers"""
    return x * y

def divide(x, y):
    """Divide first number by second"""
    if y == 0:
        return "Error: Cannot divide by zero!"
    return x / y

def get_number(prompt):
    """Get a valid number from user input"""
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Invalid input! Please enter a valid number.")

def display_menu():
    """Display the calculator menu"""
    print("\n" + "="*40)
    print("           BASIC CALCULATOR")
    print("="*40)
    print("Select operation:")
    print("1. Add (+)")
    print("2. Subtract (-)")
    print("3. Multiply (*)")
    print("4. Divide (/)")
    print("5. Exit")
    print("="*40)

def main():
    """Main calculator function"""
    print("Welcome to the Basic Calculator!")
    
    while True:
        display_menu()
        
        choice = input("Enter choice (1-5): ").strip()
        
        if choice == '5':
            print("\nThank you for using the Basic Calculator!")
            print("Goodbye!")
            break
        
        if choice in ['1', '2', '3', '4']:
            # Get numbers from user
            num1 = get_number("Enter first number: ")
            num2 = get_number("Enter second number: ")
            
            # Perform calculation based on choice
            if choice == '1':
                result = add(num1, num2)
                operation = "+"
            elif choice == '2':
                result = subtract(num1, num2)
                operation = "-"
            elif choice == '3':
                result = multiply(num1, num2)
                operation = "*"
            elif choice == '4':
                result = divide(num1, num2)
                operation = "/"
            
            # Display result
            print(f"\nResult: {num1} {operation} {num2} = {result}")
            
            # Ask if user wants to continue
            continue_calc = input("\nWould you like to perform another calculation? (y/n): ").strip().lower()
            if continue_calc not in ['y', 'yes']:
                print("\nThank you for using the Basic Calculator!")
                print("Goodbye!")
                break
        else:
            print("Invalid input! Please select a valid option (1-5).")

if __name__ == "__main__":
    main()
