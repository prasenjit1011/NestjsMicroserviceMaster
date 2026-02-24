print("\n=== Error Handling ===")
a = int(input("Enter value for a:\n"))
b = int(input("Enter value for b:\n"))

def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "Cannot divide by zero!"
    except TypeError:
        return "Invalid input types!"

print(f"a / b = {safe_divide(a, b)}")
print(f"10 / 0 = {safe_divide(10, 0)}")