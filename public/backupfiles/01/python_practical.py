# Python Practical Examples
# Real-world applications and common patterns

import requests
import random
import re
from datetime import datetime, timedelta

print("=== Practical Python Examples ===")

# 1. WEB SCRAPING / API USAGE (Simulated)
print("\n=== Working with APIs ===")

def fetch_weather_data(city="London"):
    """Simulate fetching weather data"""
    # In real scenario, you'd use: requests.get(f"https://api.weather.com/{city}")
    weather_data = {
        "city": city,
        "temperature": random.randint(15, 30),
        "humidity": random.randint(40, 80),
        "condition": random.choice(["Sunny", "Cloudy", "Rainy", "Snowy"])
    }
    return weather_data

weather = fetch_weather_data("New York")
print(f"Weather in {weather['city']}: {weather['temperature']}°C, {weather['condition']}")

# 2. DATA PROCESSING
print("\n=== Data Processing ===")

# Sample sales data
sales_data = [
    {"product": "Laptop", "price": 999, "quantity": 5, "date": "2024-01-15"},
    {"product": "Mouse", "price": 25, "quantity": 20, "date": "2024-01-16"},
    {"product": "Keyboard", "price": 75, "quantity": 10, "date": "2024-01-17"},
    {"product": "Monitor", "price": 299, "quantity": 8, "date": "2024-01-18"},
    {"product": "Laptop", "price": 999, "quantity": 3, "date": "2024-01-19"},
]

def analyze_sales(data):
    """Analyze sales data"""
    total_revenue = sum(item["price"] * item["quantity"] for item in data)
    
    # Group by product
    product_sales = {}
    for item in data:
        product = item["product"]
        revenue = item["price"] * item["quantity"]
        if product in product_sales:
            product_sales[product] += revenue
        else:
            product_sales[product] = revenue
    
    # Find best seller
    best_seller = max(product_sales.items(), key=lambda x: x[1])
    
    return {
        "total_revenue": total_revenue,
        "product_sales": product_sales,
        "best_seller": best_seller
    }

analysis = analyze_sales(sales_data)
print(f"Total Revenue: ${analysis['total_revenue']:,}")
print(f"Best Seller: {analysis['best_seller'][0]} (${analysis['best_seller'][1]:,})")
print("Product Sales:")
for product, revenue in analysis['product_sales'].items():
    print(f"  {product}: ${revenue:,}")

# 3. TEXT PROCESSING
print("\n=== Text Processing ===")

def clean_and_analyze_text(text):
    """Clean text and provide analysis"""
    # Remove special characters and convert to lowercase
    cleaned = re.sub(r'[^a-zA-Z\s]', '', text.lower())
    
    # Split into words
    words = cleaned.split()
    
    # Count words
    word_count = len(words)
    unique_words = len(set(words))
    
    # Find most common words
    word_frequency = {}
    for word in words:
        word_frequency[word] = word_frequency.get(word, 0) + 1
    
    most_common = sorted(word_frequency.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "original_text": text,
        "cleaned_text": cleaned,
        "word_count": word_count,
        "unique_words": unique_words,
        "most_common_words": most_common
    }

sample_text = """
Python is a powerful programming language! It's great for beginners and experts alike.
Python has many libraries and frameworks that make development faster and easier.
"""

text_analysis = clean_and_analyze_text(sample_text)
print(f"Word count: {text_analysis['word_count']}")
print(f"Unique words: {text_analysis['unique_words']}")
print("Most common words:")
for word, count in text_analysis['most_common_words']:
    print(f"  {word}: {count}")

# 4. TASK SCHEDULER SIMULATION
print("\n=== Task Scheduler ===")

class Task:
    def __init__(self, name, priority=1, deadline=None):
        self.name = name
        self.priority = priority
        self.deadline = deadline or datetime.now() + timedelta(days=1)
        self.completed = False
    
    def complete(self):
        self.completed = True
        print(f"Task '{self.name}' completed!")
    
    def is_overdue(self):
        return datetime.now() > self.deadline
    
    def __str__(self):
        status = "✓" if self.completed else "○"
        overdue = " (OVERDUE)" if self.is_overdue() and not self.completed else ""
        return f"{status} {self.name} (Priority: {self.priority}){overdue}"

class TaskManager:
    def __init__(self):
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append(task)
        print(f"Added task: {task.name}")
    
    def get_pending_tasks(self):
        return [task for task in self.tasks if not task.completed]
    
    def get_tasks_by_priority(self):
        return sorted(self.get_pending_tasks(), key=lambda x: x.priority, reverse=True)
    
    def show_tasks(self):
        print("All tasks:")
        for task in self.tasks:
            print(f"  {task}")

# Create task manager and add tasks
tm = TaskManager()
tm.add_task(Task("Write documentation", priority=3))
tm.add_task(Task("Fix bug #123", priority=5, deadline=datetime.now() + timedelta(hours=2)))
tm.add_task(Task("Code review", priority=2))
tm.add_task(Task("Team meeting", priority=1, deadline=datetime.now() - timedelta(hours=1)))

tm.show_tasks()

# Complete a task
tm.tasks[0].complete()
print("\nAfter completing a task:")
tm.show_tasks()

# 5. SIMPLE BANKING SYSTEM
print("\n=== Banking System Example ===")

class BankAccount:
    def __init__(self, account_number, owner, initial_balance=0):
        self.account_number = account_number
        self.owner = owner
        self.balance = initial_balance
        self.transaction_history = []
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            self.transaction_history.append(f"Deposited ${amount}")
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self.balance:
            self.balance -= amount
            self.transaction_history.append(f"Withdrew ${amount}")
            return True
        return False
    
    def get_balance(self):
        return self.balance
    
    def get_statement(self):
        print(f"Account: {self.account_number} ({self.owner})")
        print(f"Current Balance: ${self.balance}")
        print("Recent Transactions:")
        for transaction in self.transaction_history[-5:]:  # Last 5 transactions
            print(f"  - {transaction}")

# Create and use bank account
account = BankAccount("12345", "John Doe", 1000)
account.deposit(500)
account.withdraw(200)
account.deposit(100)
account.withdraw(50)

account.get_statement()

# 6. EMAIL VALIDATOR
print("\n=== Email Validator ===")

def validate_email(email):
    """Validate email format using regex"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_emails(email_list):
    """Validate multiple emails"""
    results = {}
    for email in email_list:
        results[email] = validate_email(email)
    return results

emails_to_test = [
    "user@example.com",
    "invalid.email",
    "test@domain.co.uk",
    "bad@email@domain.com",
    "good.email+tag@domain.org"
]

validation_results = validate_emails(emails_to_test)
print("Email validation results:")
for email, is_valid in validation_results.items():
    status = "✓ Valid" if is_valid else "✗ Invalid"
    print(f"  {email}: {status}")

print("\n=== End of Practical Examples ===")
