#!/usr/bin/env python3

print("=== Understanding Your Original Error ===\n")

def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "Cannot divide by zero!"

a = 10
b = 2

print("1. What you had (WRONG):")
print("Code: print(f'a / b =', {safe_divide(a, b)})")
print("Output:", f"a / b =", {safe_divide(a, b)})
print("^ Notice the curly braces around the number - that's a set!")
print()

print("2. What you should have (CORRECT):")
print("Code: print(f'a / b = {safe_divide(a, b)}')")
print("Output:", f"a / b = {safe_divide(a, b)}")
print("^ Clean output with the actual value")
print()

print("3. Why the difference?")
print("- f'text {variable}' = f-string interpolation")
print("- {value} outside f-string = creates a set data structure")
print()

print("4. Set vs f-string demonstration:")
number = 42
print("Set:", {number})           # Creates a set containing 42
print("F-string:", f"Value: {number}")  # Inserts 42 into the string
