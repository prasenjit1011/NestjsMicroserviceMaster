# To-Do List Console App Python Project

A console-based task management application that allows users to manage their daily tasks efficiently.

## Description

This project demonstrates essential Python programming concepts including:
- **Lists**: Storing and managing collections of tasks
- **Loops**: Continuous program execution and iteration through tasks
- **Conditionals**: Menu selection and task filtering
- **Functions**: Modular code organization and reusability
- **File I/O**: Persistent task storage using JSON
- **Error Handling**: Managing user input and file operations
- **Classes**: Object-oriented programming principles
- **String Manipulation**: Task formatting and validation

## Files

- `todo_list.py` - Full-featured to-do list with persistence and advanced features
- `todo_simple.py` - Simplified version focusing on core concepts
- `tasks.json` - Auto-generated file for task persistence (created when you save tasks)
- `README_TodoList.md` - This documentation file
- `Dockerfile_TodoList` - Docker configuration for containerized execution

## Features

### Full-Featured App (`todo_list.py`)
- ✅ **Add Tasks**: Create new tasks with timestamps
- 📋 **View Tasks**: Display all, pending, or completed tasks
- ✅ **Mark Complete**: Mark tasks as done with completion timestamps
- 🗑️ **Delete Tasks**: Remove unwanted tasks
- 💾 **Persistent Storage**: Save tasks to JSON file
- 🎨 **Rich Interface**: Colorful emojis and formatted output
- 📊 **Task Statistics**: Count of total, pending, and completed tasks
- ⚠️ **Confirmation Prompts**: Prevent accidental data loss

### Simple App (`todo_simple.py`)
- Basic task addition and removal
- Simple list display
- Core programming concepts demonstration
- Minimal dependencies for learning

## How to Run

### Option 1: Run the Full To-Do List
```bash
python todo_list.py
```

### Option 2: Run the Simple Version
```bash
python todo_simple.py
```

### Option 3: Run with Docker (Basic)
```bash
# Build the image
docker build -f Dockerfile_TodoList -t todo-list .

# Run the application (interactive mode)
docker run -it todo-list
```

### Option 4: Run with Docker (Persistent Storage)
```bash
# Create data directory and copy initial tasks
mkdir data
copy tasks.json data\tasks.json

# Build the image with persistence support
docker build -f Dockerfile_TodoList -t todo-list-v4 .

# Run with volume mount for persistent storage
docker run -it -v "${PWD}/data:/app/data" -e TASK_FILE="/app/data/tasks.json" todo-list-v4

# Or use the helper script
run_todo_docker.bat
```

## Sample Usage

```
🎯 Welcome to your Personal To-Do List Manager!

==================================================
               TO-DO LIST MANAGER
==================================================
1. View all tasks
2. Add a new task
3. Mark task as complete
4. Delete a task
5. View completed tasks
6. View pending tasks
7. Clear all tasks
8. Save and Exit
==================================================

🎯 Enter your choice (1-8): 2

📝 Enter task description: Learn Python programming
✅ Task 'Learn Python programming' added successfully!

📱 Press Enter to continue...
```

## Learning Objectives

After completing this project, students will understand:

### Core Concepts
1. **Lists**: Creating, modifying, and iterating through collections
2. **Loops**: Using `while` and `for` loops for program flow
3. **Conditionals**: Implementing decision-making logic
4. **Functions**: Breaking code into reusable components
5. **Input/Output**: Getting user input and displaying formatted output

### Advanced Concepts
6. **File Handling**: Reading and writing JSON data
7. **Error Handling**: Using try-except blocks
8. **Classes**: Object-oriented programming basics
9. **Data Structures**: Working with dictionaries and nested data
10. **String Methods**: Text processing and validation

## Data Structure

Tasks are stored as dictionaries with the following structure:
```python
{
    "description": "Task description",
    "completed": False,
    "created": "2025-10-18 10:30:00",
    "completed_date": None
}
```

## Project Progression

This project builds on previous concepts:
- **Project 1 (Hello World)**: Basic syntax and output
- **Project 2 (Calculator)**: Variables, input, functions
- **Project 3 (To-Do List)**: **Lists, loops, conditionals** ← Current project

And prepares for upcoming projects:
- **Project 4 (Number Guessing)**: Random module and game logic
- **Project 5 (File Reader)**: Advanced file operations

## Requirements

- Python 3.x
- Docker (optional, for containerized execution)
- No external dependencies required

## Project Creation Prompts

This To-Do List project was created using the following prompts with GitHub Copilot:

1. **Initial Request**: "create project : To-Do List (Console App) in python"
   - Created the full-featured to-do list application (`todo_list.py`)
   - Added a simplified version for beginners (`todo_simple.py`)
   - Implemented comprehensive documentation (`README_TodoList.md`)
   - Added Docker support for containerized execution (`Dockerfile_TodoList`)
   - Included persistent storage using JSON files
   - Implemented rich emoji-based user interface
   - Added timestamp tracking for task creation and completion

2. **Docker Execution**: "run with docker"
   - Built the Docker image using the todo-specific Dockerfile
   - Ran the to-do list application in interactive Docker container
   - Successfully tested all features: add, view, complete, delete tasks
   - Demonstrated task persistence and timestamp functionality
   - Verified emoji-based UI and formatted output in container environment

3. **Documentation**: "save prompt"
   - Updated README with project creation prompts
   - Documented the step-by-step creation process
   - Preserved the exact prompts used for future reference

4. **Persistence Issue**: "task.json not update"
   - Identified Docker container ephemeral storage issue
   - Updated application code to support environment variables
   - Created volume mounting solution for persistent storage
   - Set up data directory structure for host-side persistence

5. **Final Documentation**: "save pompt and cmd"
   - Documented all commands and solutions for persistence
   - Added troubleshooting steps and Docker commands
   - Created comprehensive reference for future use

## Docker Commands Reference

### **Problem**: tasks.json not updating on host machine
**Solution**: Use volume mounting for persistent storage

### **Commands Used**:

1. **Create data directory**:
   ```bash
   mkdir data
   copy tasks.json data\tasks.json
   ```

2. **Build Docker image with persistence support**:
   ```bash
   docker build -f Dockerfile_TodoList -t todo-list-v4 .
   ```

3. **Run with persistent storage**:
   ```bash
   docker run -it -v "${PWD}/data:/app/data" -e TASK_FILE="/app/data/tasks.json" todo-list-v4
   ```

4. **Verify persistence**:
   ```bash
   type data\tasks.json
   ```

5. **Alternative (use helper script)**:
   ```bash
   run_todo_docker.bat
   ```

### **Key Files for Persistence**:
- `data/tasks.json` - Persistent task storage (updated by Docker)
- `run_todo_docker.bat` - Helper script for easy execution
- `Dockerfile_TodoList` - Updated with volume support
- `todo_list.py` - Modified to use TASK_FILE environment variable

### **Troubleshooting**:
- If tasks don't persist: Ensure volume mount is correct
- If file not found: Check data directory exists and contains tasks.json
- If permissions issue: Ensure Docker has access to host directory

## Author

Created as part of a Python learning roadmap, demonstrating the progression from basic I/O to data structure management using GitHub Copilot assistance.
