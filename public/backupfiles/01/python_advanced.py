# Advanced Python Concepts
# This file demonstrates more advanced Python features

import datetime
import json
from collections import defaultdict, Counter
from functools import reduce

print("=== Advanced Python Concepts ===")

# 1. DECORATORS
print("\n=== Decorators ===")

def timer_decorator(func):
    """Decorator to measure function execution time"""
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer_decorator
def slow_function():
    """A function that takes some time"""
    import time
    time.sleep(0.1)
    return "Function completed!"

print(slow_function())

# 2. GENERATORS
print("\n=== Generators ===")

def fibonacci_generator(n):
    """Generate Fibonacci sequence up to n numbers"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print("Fibonacci sequence (first 10 numbers):")
for num in fibonacci_generator(10):
    print(num, end=" ")
print()

# Generator expression
squares_gen = (x**2 for x in range(5))
print(f"Squares from generator: {list(squares_gen)}")

# 3. LAMBDA FUNCTIONS
print("\n=== Lambda Functions ===")

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Filter even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Even numbers: {evens}")

# Map - square all numbers
squares = list(map(lambda x: x**2, numbers))
print(f"Squares: {squares}")

# Reduce - sum all numbers
total = reduce(lambda x, y: x + y, numbers)
print(f"Sum of numbers: {total}")

# 4. WORKING WITH FILES
print("\n=== File Operations ===")

# Write to file
data = {
    "students": [
        {"name": "Alice", "grade": 90},
        {"name": "Bob", "grade": 85},
        {"name": "Charlie", "grade": 92}
    ]
}

# Write JSON data
with open("students.json", "w") as file:
    json.dump(data, file, indent=2)

# Read JSON data
with open("students.json", "r") as file:
    loaded_data = json.load(file)
    print("Loaded student data:")
    for student in loaded_data["students"]:
        print(f"  {student['name']}: {student['grade']}")

# 5. COLLECTIONS MODULE
print("\n=== Collections Module ===")

# defaultdict
word_count = defaultdict(int)
text = "hello world hello python world"
for word in text.split():
    word_count[word] += 1

print(f"Word count: {dict(word_count)}")

# Counter
letters = Counter("hello world")
print(f"Letter frequency: {letters}")
print(f"Most common letters: {letters.most_common(3)}")

# 6. DATE AND TIME
print("\n=== Date and Time ===")

now = datetime.datetime.now()
print(f"Current date and time: {now}")
print(f"Formatted date: {now.strftime('%Y-%m-%d %H:%M:%S')}")

# Date arithmetic
tomorrow = now + datetime.timedelta(days=1)
print(f"Tomorrow: {tomorrow.strftime('%Y-%m-%d')}")

# 7. CONTEXT MANAGERS
print("\n=== Context Managers ===")

class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        print(f"Opening file: {self.filename}")
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Closing file: {self.filename}")
        if self.file:
            self.file.close()

# Using the context manager
with FileManager("test.txt", "w") as f:
    f.write("Hello from context manager!")

# 8. INHERITANCE AND POLYMORPHISM
print("\n=== Inheritance and Polymorphism ===")

class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass
    
    def info(self):
        return f"This is {self.name}"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

class Bird(Animal):
    def __init__(self, name, can_fly=True):
        super().__init__(name)
        self.can_fly = can_fly
    
    def speak(self):
        return f"{self.name} says Tweet!"
    
    def fly(self):
        return f"{self.name} is flying!" if self.can_fly else f"{self.name} cannot fly"

# Polymorphism in action
animals = [
    Dog("Buddy"),
    Cat("Whiskers"),
    Bird("Tweety"),
    Bird("Penguin", can_fly=False)
]

for animal in animals:
    print(animal.speak())
    if isinstance(animal, Bird):
        print(f"  {animal.fly()}")

# 9. PROPERTY DECORATORS
print("\n=== Property Decorators ===")

class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature cannot be below absolute zero")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5/9

temp = Temperature(25)
print(f"Temperature: {temp.celsius}°C = {temp.fahrenheit}°F")

temp.fahrenheit = 86
print(f"After setting to 86°F: {temp.celsius}°C = {temp.fahrenheit}°F")

print("\n=== End of Advanced Tutorial ===")
