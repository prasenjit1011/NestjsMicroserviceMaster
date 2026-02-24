#!/usr/bin/env python3
"""
Simple To-Do List - Beginner Version
A basic to-do list for learning Python fundamentals.
"""

def main():
    """Simple to-do list application"""
    print("=== Simple To-Do List ===")
    
    # Initialize empty list to store tasks
    tasks = []
    
    while True:
        print("\n--- MENU ---")
        print("1. View tasks")
        print("2. Add task")
        print("3. Remove task")
        print("4. Exit")
        
        choice = input("Enter your choice (1-4): ")
        
        if choice == '1':
            # View all tasks
            if len(tasks) == 0:
                print("\nNo tasks in your list!")
            else:
                print(f"\nYour tasks ({len(tasks)} total):")
                for i in range(len(tasks)):
                    print(f"{i + 1}. {tasks[i]}")
        
        elif choice == '2':
            # Add a new task
            task = input("Enter a new task: ")
            if task.strip():  # Check if task is not empty
                tasks.append(task)
                print(f"Task '{task}' added!")
            else:
                print("Task cannot be empty!")
        
        elif choice == '3':
            # Remove a task
            if len(tasks) == 0:
                print("No tasks to remove!")
            else:
                # Show current tasks
                print("\nCurrent tasks:")
                for i in range(len(tasks)):
                    print(f"{i + 1}. {tasks[i]}")
                
                try:
                    task_num = int(input("Enter task number to remove: "))
                    if 1 <= task_num <= len(tasks):
                        removed_task = tasks.pop(task_num - 1)
                        print(f"Task '{removed_task}' removed!")
                    else:
                        print("Invalid task number!")
                except ValueError:
                    print("Please enter a valid number!")
        
        elif choice == '4':
            # Exit
            print("Thank you for using Simple To-Do List!")
            break
        
        else:
            print("Invalid choice! Please select 1-4.")


if __name__ == "__main__":
    main()
