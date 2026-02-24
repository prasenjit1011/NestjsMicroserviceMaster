# Python Fundamentals Tutorial
# This file demonstrates core Python concepts

# 1. VARIABLES AND DATA TYPES
print("=== Variables and Data Types ===")

# Numbers
age = 25
height = 5.9
is_student = True

# Strings
name = "Alice"
greeting = 'Hello, World!'
multiline = """This is a
multiline string"""

print(f"Name: {name}, Age: {age}, Height: {height}, Student: {is_student}")

# 2. LISTS (Arrays)
print("\n=== Lists ===")
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]

print(f"Fruits: {fruits}")
print(f"First fruit: {fruits[0]}")
print(f"Last fruit: {fruits[-1]}")

# List methods
fruits.append("grape")
fruits.insert(1, "kiwi")
print(f"After adding: {fruits}")

# 3. DICTIONARIES (Key-Value pairs)
print("\n=== Dictionaries ===")
person = {
    "name": "Bob",
    "age": 30,
    "city": "New York",
    "hobbies": ["reading", "swimming"]
}

print(f"Person: {person}")
print(f"Name: {person['name']}")
print(f"Age: {person.get('age', 'Unknown')}")

# 4. CONTROL STRUCTURES
print("\n=== Control Structures ===")

# If statements
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Score: {score}, Grade: {grade}")

# For loops
print("\nFor loop with range:")
for i in range(5):
    print(f"Number: {i}")

print("\nFor loop with list:")
for fruit in fruits:
    print(f"I like {fruit}")

# While loop
print("\nWhile loop:")
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1

# 5. FUNCTIONS
print("\n=== Functions ===")

def greet(name, greeting="Hello"):
    """This function greets a person"""
    return f"{greeting}, {name}!"

def calculate_area(length, width):
    """Calculate rectangle area"""
    return length * width

def get_even_numbers(numbers):
    """Return only even numbers from a list"""
    return [num for num in numbers if num % 2 == 0]

print(greet("Alice"))
print(greet("Bob", "Hi"))
print(f"Area of 5x3 rectangle: {calculate_area(5, 3)}")
print(f"Even numbers from {numbers}: {get_even_numbers(numbers)}")

# 6. LIST COMPREHENSIONS
print("\n=== List Comprehensions ===")
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]

print(f"Squares: {squares}")
print(f"Even squares: {even_squares}")

# 7. ERROR HANDLING
print("\n=== Error Handling ===")

def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "Cannot divide by zero!"
    except TypeError:
        return "Invalid input types!"

print(f"10 / 2 = {safe_divide(10, 2)}")
print(f"10 / 0 = {safe_divide(10, 0)}")

# 8. CLASSES AND OBJECTS
print("\n=== Classes and Objects ===")

class Dog:
    def __init__(self, name, breed, age):
        self.name = name
        self.breed = breed
        self.age = age
    
    def bark(self):
        return f"{self.name} says Woof!"
    
    def get_info(self):
        return f"{self.name} is a {self.age} year old {self.breed}"

# Create objects
my_dog = Dog("Buddy", "Golden Retriever", 3)
another_dog = Dog("Max", "German Shepherd", 5)

print(my_dog.bark())
print(my_dog.get_info())
print(another_dog.get_info())

print("\n=== End of Basic Tutorial ===")
