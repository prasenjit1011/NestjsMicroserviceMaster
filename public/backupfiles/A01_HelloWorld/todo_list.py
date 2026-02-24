#!/usr/bin/env python3
"""
To-Do List Console App
A simple console-based task management application.
"""

import json
import os
import signal
import sys
from datetime import datetime

class TodoList:
    """A simple To-Do List manager"""
    
    def __init__(self):
        """Initialize the to-do list"""
        self.tasks = []
        # Use environment variable for task file location, fallback to default
        self.filename = os.environ.get('TASK_FILE', 'tasks.json')
        
        # Ensure we're using absolute path for consistency
        if not os.path.isabs(self.filename):
            self.filename = os.path.abspath(self.filename)
            
        self.load_tasks()
        
        # Set up signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
    
    def signal_handler(self, sig, frame):
        """Handle interrupt signals to save data before exit"""
        print(f"\n\n🛡️ Received signal {sig}, saving tasks before exit...")
        self.save_tasks()
        print("💾 Tasks saved successfully!")
        print("👋 Goodbye! Your tasks are safe!")
        sys.exit(0)
    
    def display_menu(self):
        """Display the main menu"""
        print("\n" + "="*50)
        print("               TO-DO LIST MANAGER")
        print("="*50)
        print("1. View all tasks")
        print("2. Add a new task")
        print("3. Mark task as complete")
        print("4. Delete a task")
        print("5. View completed tasks")
        print("6. View pending tasks")
        print("7. Clear all tasks")
        print("8. Show file info")
        print("9. Save and Exit")
        print("="*50)
    
    def view_all_tasks(self):
        """Display all tasks"""
        if not self.tasks:
            print("\n📝 Your to-do list is empty!")
            return
        
        print(f"\n📋 ALL TASKS ({len(self.tasks)} total)")
        print("-" * 50)
        for i, task in enumerate(self.tasks, 1):
            status = "✅" if task['completed'] else "⏳"
            created = task.get('created', 'Unknown')
            print(f"{i}. {status} {task['description']}")
            print(f"   Created: {created}")
            if task['completed']:
                completed_date = task.get('completed_date', 'Unknown')
                print(f"   Completed: {completed_date}")
            print()
    
    def add_task(self):
        """Add a new task"""
        description = input("\n📝 Enter task description: ").strip()
        if description:
            task = {
                'description': description,
                'completed': False,
                'created': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'completed_date': None
            }
            self.tasks.append(task)
            self.save_tasks()  # Auto-save after adding task
            print(f"✅ Task '{description}' added successfully!")
        else:
            print("❌ Task description cannot be empty!")
    
    def mark_complete(self):
        """Mark a task as complete"""
        if not self.tasks:
            print("\n📝 No tasks available to complete!")
            return
        
        self.view_pending_tasks()
        try:
            task_num = int(input("\n🎯 Enter task number to mark as complete: "))
            if 1 <= task_num <= len(self.tasks):
                task = self.tasks[task_num - 1]
                if not task['completed']:
                    task['completed'] = True
                    task['completed_date'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    self.save_tasks()  # Auto-save after marking complete
                    print(f"🎉 Task '{task['description']}' marked as complete!")
                else:
                    print("ℹ️ Task is already completed!")
            else:
                print("❌ Invalid task number!")
        except ValueError:
            print("❌ Please enter a valid number!")
    
    def delete_task(self):
        """Delete a task"""
        if not self.tasks:
            print("\n📝 No tasks available to delete!")
            return
        
        self.view_all_tasks()
        try:
            task_num = int(input("\n🗑️ Enter task number to delete: "))
            if 1 <= task_num <= len(self.tasks):
                deleted_task = self.tasks.pop(task_num - 1)
                self.save_tasks()  # Auto-save after deleting task
                print(f"🗑️ Task '{deleted_task['description']}' deleted successfully!")
            else:
                print("❌ Invalid task number!")
        except ValueError:
            print("❌ Please enter a valid number!")
    
    def view_completed_tasks(self):
        """Display only completed tasks"""
        completed = [task for task in self.tasks if task['completed']]
        if not completed:
            print("\n🎉 No completed tasks yet!")
            return
        
        print(f"\n✅ COMPLETED TASKS ({len(completed)} total)")
        print("-" * 50)
        for i, task in enumerate(completed, 1):
            completed_date = task.get('completed_date', 'Unknown')
            print(f"{i}. ✅ {task['description']}")
            print(f"   Completed: {completed_date}")
            print()
    
    def view_pending_tasks(self):
        """Display only pending tasks"""
        pending = [task for task in self.tasks if not task['completed']]
        if not pending:
            print("\n🎉 No pending tasks! You're all caught up!")
            return
        
        print(f"\n⏳ PENDING TASKS ({len(pending)} total)")
        print("-" * 50)
        for i, task in enumerate(self.tasks, 1):
            if not task['completed']:
                created = task.get('created', 'Unknown')
                print(f"{i}. ⏳ {task['description']}")
                print(f"   Created: {created}")
                print()
    
    def clear_all_tasks(self):
        """Clear all tasks after confirmation"""
        if not self.tasks:
            print("\n📝 No tasks to clear!")
            return
        
        confirm = input(f"\n⚠️ Are you sure you want to delete all {len(self.tasks)} tasks? (yes/no): ").strip().lower()
        if confirm in ['yes', 'y']:
            self.tasks.clear()
            self.save_tasks()  # Auto-save after clearing tasks
            print("🗑️ All tasks cleared successfully!")
        else:
            print("ℹ️ Operation cancelled.")
    
    def show_file_info(self):
        """Show current file path and status"""
        print(f"\n📁 File Information:")
        print(f"   File Path: {self.filename}")
        print(f"   File Exists: {os.path.exists(self.filename)}")
        if os.path.exists(self.filename):
            try:
                stat = os.stat(self.filename)
                import time
                mod_time = time.ctime(stat.st_mtime)
                size = stat.st_size
                print(f"   File Size: {size} bytes")
                print(f"   Last Modified: {mod_time}")
            except Exception as e:
                print(f"   Error getting file info: {e}")
        print(f"   Current Working Directory: {os.getcwd()}")
        print(f"   Environment TASK_FILE: {os.environ.get('TASK_FILE', 'Not set')}")
    def save_tasks(self):
        """Save tasks to file"""
        try:
            # Ensure directory exists
            directory = os.path.dirname(self.filename)
            if directory and not os.path.exists(directory):
                os.makedirs(directory, exist_ok=True)
                
            with open(self.filename, 'w') as file:
                json.dump(self.tasks, file, indent=2)
            # Removed the "Tasks saved successfully!" message to avoid spam during auto-save
        except Exception as e:
            print(f"❌ Error saving tasks to {self.filename}: {e}")
    
    def load_tasks(self):
        """Load tasks from file"""
        try:
            if os.path.exists(self.filename):
                with open(self.filename, 'r') as file:
                    self.tasks = json.load(file)
                if self.tasks:
                    print(f"📂 Loaded {len(self.tasks)} tasks from {self.filename}")
                else:
                    print("📝 Starting with a fresh to-do list!")
            else:
                print(f"📝 Starting with a fresh to-do list! (File: {self.filename})")
        except Exception as e:
            print(f"⚠️ Error loading tasks from {self.filename}: {e}")
            print("📝 Starting with a fresh to-do list!")
            self.tasks = []
    
    def run(self):
        """Main application loop"""
        print("🎯 Welcome to your Personal To-Do List Manager!")
        
        while True:
            self.display_menu()
            
            try:
                choice = input("\n🎯 Enter your choice (1-9): ").strip()
                
                if choice == '1':
                    self.view_all_tasks()
                elif choice == '2':
                    self.add_task()
                elif choice == '3':
                    self.mark_complete()
                elif choice == '4':
                    self.delete_task()
                elif choice == '5':
                    self.view_completed_tasks()
                elif choice == '6':
                    self.view_pending_tasks()
                elif choice == '7':
                    self.clear_all_tasks()
                elif choice == '8':
                    self.show_file_info()
                elif choice == '9':
                    self.save_tasks()
                    print("💾 Final save completed!")
                    print("\n👋 Thank you for using To-Do List Manager!")
                    print("💫 Stay organized and productive!")
                    break
                else:
                    print("❌ Invalid choice! Please select 1-9.")
                
                # Pause before showing menu again
                input("\n📱 Press Enter to continue...")
                
            except KeyboardInterrupt:
                print("\n\n�️ Interrupt received, saving tasks...")
                self.save_tasks()
                print("💾 Tasks saved successfully!")
                print("👋 Goodbye! Your tasks are safe!")
                break
            except Exception as e:
                print(f"❌ An error occurred: {e}")


def main():
    """Main function to run the To-Do List application"""
    todo_app = TodoList()
    todo_app.run()


if __name__ == "__main__":
    main()
