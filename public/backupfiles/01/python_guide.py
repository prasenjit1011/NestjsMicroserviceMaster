# Python Learning Path and Best Practices
# A comprehensive guide for Python learners

"""
PYTHON LEARNING PATH
===================

BEGINNER LEVEL (Start Here):
1. Variables and Data Types
2. Control Structures (if/else, loops)
3. Functions
4. Lists, Dictionaries, Tuples
5. Basic File Operations
6. Error Handling (try/except)

INTERMEDIATE LEVEL:
1. Object-Oriented Programming (Classes, Inheritance)
2. Modules and Packages
3. List Comprehensions
4. Decorators
5. Generators
6. Regular Expressions

ADVANCED LEVEL:
1. Context Managers
2. Metaclasses
3. Async/Await (Asynchronous Programming)
4. Design Patterns
5. Testing (unittest, pytest)
6. Performance Optimization

SPECIALIZED AREAS:
- Web Development: Flask, Django, FastAPI
- Data Science: NumPy, Pandas, Matplotlib, Scikit-learn
- Machine Learning: TensorFlow, PyTorch
- Desktop Apps: Tkinter, PyQt, Kivy
- Game Development: Pygame
- Automation: Selenium, Beautiful Soup
"""

print("=== Python Best Practices and Tips ===")

# 1. PYTHONIC CODE EXAMPLES
print("\n=== Writing Pythonic Code ===")

# Good: Use list comprehensions
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print(f"Squares (Pythonic): {squares}")

# Good: Use enumerate for index and value
fruits = ['apple', 'banana', 'orange']
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# Good: Use zip to iterate over multiple lists
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"{name} is {age} years old")

# Good: Use f-strings for formatting
name = "Python"
version = 3.9
print(f"I'm learning {name} {version}")

# 2. COMMON PYTHON PATTERNS
print("\n=== Common Python Patterns ===")

# Singleton Pattern
class Singleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# Factory Pattern
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

class AnimalFactory:
    @staticmethod
    def create_animal(animal_type):
        if animal_type.lower() == 'dog':
            return Dog()
        elif animal_type.lower() == 'cat':
            return Cat()
        else:
            raise ValueError(f"Unknown animal type: {animal_type}")

# Using the factory
dog = AnimalFactory.create_animal('dog')
cat = AnimalFactory.create_animal('cat')
print(f"Dog says: {dog.speak()}")
print(f"Cat says: {cat.speak()}")

# 3. DEBUGGING TIPS
print("\n=== Debugging Tips ===")

def debug_example():
    """Example of debugging techniques"""
    import pdb  # Python debugger
    
    data = [1, 2, 3, 4, 5]
    
    # Use print statements for simple debugging
    print(f"Debug: data = {data}")
    
    # Use assert for debugging assumptions
    assert len(data) > 0, "Data should not be empty"
    
    # Use logging instead of print for production code
    import logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    logger.debug(f"Processing data: {data}")
    
    return sum(data)

result = debug_example()
print(f"Result: {result}")

# 4. PERFORMANCE TIPS
print("\n=== Performance Tips ===")

import time

def performance_comparison():
    """Compare different approaches for performance"""
    
    # Timing decorator
    def timer(func):
        def wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            end = time.time()
            print(f"{func.__name__}: {end - start:.6f} seconds")
            return result
        return wrapper
    
    @timer
    def list_approach():
        return [x**2 for x in range(10000)]
    
    @timer
    def generator_approach():
        return (x**2 for x in range(10000))
    
    # List is slower but creates all values immediately
    list_result = list_approach()
    
    # Generator is faster but creates values on demand
    gen_result = generator_approach()
    
    print(f"List length: {len(list_result)}")
    print(f"Generator type: {type(gen_result)}")

performance_comparison()

# 5. TESTING EXAMPLES
print("\n=== Testing Examples ===")

def add_numbers(a, b):
    """Simple function to test"""
    return a + b

def divide_numbers(a, b):
    """Function that can raise exceptions"""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# Simple test function
def test_add_numbers():
    """Test the add_numbers function"""
    assert add_numbers(2, 3) == 5
    assert add_numbers(-1, 1) == 0
    assert add_numbers(0, 0) == 0
    print("✓ add_numbers tests passed")

def test_divide_numbers():
    """Test the divide_numbers function"""
    assert divide_numbers(10, 2) == 5
    assert divide_numbers(7, 2) == 3.5
    
    # Test exception handling
    try:
        divide_numbers(5, 0)
        assert False, "Should have raised ValueError"
    except ValueError:
        print("✓ divide_numbers exception test passed")
    
    print("✓ divide_numbers tests passed")

# Run tests
test_add_numbers()
test_divide_numbers()

# 6. COMMON MISTAKES TO AVOID
print("\n=== Common Mistakes to Avoid ===")

print("1. Mutable default arguments:")
# BAD: Don't do this
def bad_function(items=[]):
    items.append("new item")
    return items

# GOOD: Do this instead
def good_function(items=None):
    if items is None:
        items = []
    items.append("new item")
    return items

print("2. Late binding closures:")
# BAD: This will print 3, 3, 3
functions = []
for i in range(3):
    functions.append(lambda: i)

# GOOD: This will print 0, 1, 2
functions_good = []
for i in range(3):
    functions_good.append(lambda x=i: x)

print("3. Using 'is' for value comparison:")
# BAD: Don't compare values with 'is'
# if name is "John":  # Wrong!

# GOOD: Use '==' for value comparison
name = "John"
if name == "John":
    print("✓ Correct comparison")

# 7. USEFUL BUILT-IN FUNCTIONS
print("\n=== Useful Built-in Functions ===")

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

print(f"any([True, False, False]): {any([True, False, False])}")
print(f"all([True, True, False]): {all([True, True, False])}")
print(f"sum(numbers): {sum(numbers)}")
print(f"min(numbers): {min(numbers)}")
print(f"max(numbers): {max(numbers)}")
print(f"sorted(numbers, reverse=True): {sorted(numbers, reverse=True)}")

# zip and enumerate are very useful
names = ['Alice', 'Bob', 'Charlie']
scores = [85, 92, 78]

print("\nUsing zip and enumerate:")
for i, (name, score) in enumerate(zip(names, scores), 1):
    print(f"{i}. {name}: {score}")

print("\n=== Next Steps for Learning ===")
print("""
RECOMMENDED LEARNING PATH:

1. Practice with coding challenges (LeetCode, HackerRank, Codewars)
2. Build small projects (calculator, to-do list, weather app)
3. Learn popular libraries:
   - requests (for HTTP requests)
   - pandas (for data analysis)
   - flask/django (for web development)
   - matplotlib (for plotting)
4. Read other people's code on GitHub
5. Contribute to open-source projects
6. Learn about virtual environments (venv, conda)
7. Understand package management (pip, pipenv, poetry)
8. Learn version control (Git)
9. Practice writing tests
10. Deploy your applications

USEFUL RESOURCES:
- Official Python documentation: https://docs.python.org/
- Real Python: https://realpython.com/
- Python Package Index (PyPI): https://pypi.org/
- GitHub for code examples and projects
- Stack Overflow for problem solving

Remember: The best way to learn Python is by writing code!
Start with small projects and gradually increase complexity.
""")
