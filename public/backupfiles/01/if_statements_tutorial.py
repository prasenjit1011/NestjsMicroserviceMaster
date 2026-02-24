#!/usr/bin/env python3

print("=== Python IF Statements Tutorial ===\n")

# 1. Basic if statement
print("1. Basic if statement:")
age = 18
if age >= 18:
    print(f"You are {age} years old - you can vote!")
print()

# 2. if-else statement
print("2. if-else statement:")
temperature = 25
if temperature > 30:
    print("It's hot outside!")
else:
    print("It's not too hot today.")
print()

# 3. if-elif-else chain
print("3. if-elif-else chain:")
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
print(f"Score: {score}, Grade: {grade}")
print()

# 4. Multiple conditions with and/or
print("4. Multiple conditions:")
hour = 14
weather = "sunny"

if hour >= 12 and hour < 18:
    print("It's afternoon")

if weather == "sunny" or weather == "partly cloudy":
    print("Good weather for a walk!")

if hour > 10 and weather == "sunny":
    print("Perfect time for outdoor activities!")
print()

# 5. Nested if statements
print("5. Nested if statements:")
user_age = 16
has_license = False

if user_age >= 16:
    print("You're old enough to drive")
    if has_license:
        print("You can drive!")
    else:
        print("But you need a license first")
else:
    print(f"You need to wait {16 - user_age} more years to drive")
print()

# 6. if with different data types
print("6. if with different data types:")

# String comparisons
name = "Alice"
if name == "Alice":
    print("Hello Alice!")

# List/collection checks
fruits = ["apple", "banana", "orange"]
if "apple" in fruits:
    print("We have apples!")

if len(fruits) > 2:
    print(f"We have {len(fruits)} different fruits")

# Boolean checks
is_student = True
if is_student:
    print("Student discount applied!")

# None checks
value = None
if value is None:
    print("Value is None")
if value is not None:
    print("Value has something")
print()

# 7. Ternary operator (conditional expression)
print("7. Ternary operator:")
x = 10
result = "positive" if x > 0 else "negative or zero"
print(f"{x} is {result}")

# More ternary examples
age = 20
status = "adult" if age >= 18 else "minor"
print(f"Age {age}: {status}")
print()

# 8. Interactive example
print("8. Interactive number guessing:")
secret_number = 7
print("I'm thinking of a number between 1 and 10...")

try:
    guess = int(input("Enter your guess: "))
    
    if guess == secret_number:
        print("🎉 Congratulations! You guessed it!")
    elif guess < secret_number:
        print("Too low! Try a higher number.")
    else:
        print("Too high! Try a lower number.")
        
    # Additional feedback
    if abs(guess - secret_number) <= 1:
        print("You were very close!")
    elif abs(guess - secret_number) <= 3:
        print("You were close!")
    else:
        print("Not very close, but keep trying!")
        
except ValueError:
    print("Please enter a valid number!")
print()

# 9. Complex conditions example
print("9. Complex conditions example:")
username = "admin"
password = "secret123"
attempts = 2

if username == "admin" and password == "secret123" and attempts < 3:
    print("✅ Login successful!")
elif attempts >= 3:
    print("❌ Account locked due to too many attempts")
elif username != "admin":
    print("❌ Invalid username")
else:
    print("❌ Invalid password")
print()

# 10. Checking multiple values
print("10. Checking multiple values:")
day = "Saturday"

# Check if it's weekend
if day in ["Saturday", "Sunday"]:
    print("It's weekend! 🎉")

# Check valid days
valid_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
if day in valid_days:
    print(f"{day} is a valid day")

# Number range checking
number = 25
if 1 <= number <= 100:
    print(f"{number} is between 1 and 100")
print()

print("=== End of IF Statements Tutorial ===")
