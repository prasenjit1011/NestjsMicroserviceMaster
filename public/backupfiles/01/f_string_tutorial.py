#!/usr/bin/env python3

print("=== F-String Tutorial ===\n")

# What is an f-string?
# An f-string is a way to embed expressions inside string literals
# You put 'f' before the quote and use {} to insert variables/expressions

name = "Alice"
age = 25
score = 95.7

print("1. Basic f-string usage:")
print(f"Hello, my name is {name} and I am {age} years old.")
print()

print("2. Compare with other string formatting methods:")
# Old way 1: % formatting
print("% formatting: Hello, my name is %s and I am %d years old." % (name, age))

# Old way 2: .format() method
print(".format() method: Hello, my name is {} and I am {} years old.".format(name, age))

# Modern way: f-strings (Python 3.6+)
print(f"f-string: Hello, my name is {name} and I am {age} years old.")
print()

print("3. F-strings can contain expressions:")
print(f"Next year I'll be {age + 1} years old")
print(f"My score percentage is {score}%")
print(f"Is my score above 90? {score > 90}")
print()

print("4. F-strings with function calls:")
def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"

print(f"With a score of {score}, my grade is {get_grade(score)}")
print()

print("5. F-strings with formatting options:")
pi = 3.14159265359
print(f"Pi to 2 decimal places: {pi:.2f}")
print(f"Pi to 4 decimal places: {pi:.4f}")

large_number = 1234567
print(f"Large number with commas: {large_number:,}")
print()

print("6. Your original code issue:")
a = 10
b = 2

def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "Cannot divide by zero!"

# WRONG - extra braces create a set:
print("Wrong way:", f"a / b = {safe_divide(a, b)}")  # This would show {2.0}

# CORRECT - single braces for f-string:
print("Correct way:", f"a / b = {safe_divide(a, b)}")  # This shows 5.0
print()

print("7. More advanced f-string features:")
items = ["apple", "banana", "cherry"]
print(f"I have {len(items)} items: {', '.join(items)}")

person = {"name": "Bob", "city": "New York"}
print(f"{person['name']} lives in {person['city']}")
