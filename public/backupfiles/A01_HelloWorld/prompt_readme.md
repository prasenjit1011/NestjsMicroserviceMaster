# Project Development Prompts & Commands

This document contains all the prompts and commands used to create and improve the Python learning projects, specifically focusing on the To-Do List Console App development process.

## docker run -it -v "${PWD}:/app" -e TASK_FILE="/app/tasks.json" todo-list-v5

## 📋 **Project Creation Sequence**

### **Project 1: Hello World**
**Prompt**: `create "Hello World" project in python`
- Created hello_world.py with basic functionality
- Added comprehensive README.md documentation
- Created .gitignore for Python projects

**Follow-up**: `run the project with docker`
- Added Dockerfile for containerization
- Created .dockerignore file
- Updated README with Docker instructions

**Documentation**: `save prompt in readme file`
- Added project creation prompts to README
- Documented the development process

### **Project 2: Basic Calculator** 
**Prompt**: `create Basic Calculator project`
- Created calculator.py with full menu system
- Added calculator_simple.py for beginners
- Created comprehensive documentation
- Added Docker support

**Docker Execution**: `run using docker`
- Built Docker image for calculator
- Tested interactive functionality
- Verified containerized execution

**Documentation**: `save my prompt for calculator`
- Updated README with creation prompts
- Documented Docker testing process

### **Project 3: To-Do List Console App**
**Initial Prompt**: `create project : To-Do List (Console App) in python`
- Created todo_list.py with full-featured task management
- Added todo_simple.py for learning fundamentals
- Implemented comprehensive documentation
- Added Docker support with persistence
- Included JSON-based task storage

**Docker Testing**: `run with docker`
- Built Docker image for to-do list
- Tested all features interactively
- Verified task management functionality

**Documentation**: `save prompt`
- Updated README with project creation history
- Documented development progression

**Persistence Issue**: `save to do list in json ... to prevent data lost`
- Implemented auto-save functionality
- Added signal handlers for graceful shutdown
- Created automatic JSON persistence after operations

**Docker Persistence**: `sample_tasks.json not working`
- Identified Docker container ephemeral storage issue
- Fixed file naming mismatch (sample_tasks.json → tasks.json)
- Updated Dockerfile to include JSON files

**Volume Mounting**: `task.json not update`
- Implemented Docker volume mounting solution
- Added environment variable support (TASK_FILE)
- Created data directory for persistent storage
- Updated application to use configurable file paths

**Final Documentation**: `save pompt and cmd`
- Documented all troubleshooting steps
- Added comprehensive command reference
- Created helper scripts for easy execution

**Archive Creation**: `copy all pompt and cmd to pompt_readme.md`
- Created dedicated prompt documentation file
- Archived complete development history

## 🐳 **Docker Commands Reference**

### **Basic Commands**
```bash
# Build images
docker build -t hello-world-python .
docker build -f Dockerfile_Calculator -t basic-calculator .
docker build -f Dockerfile_TodoList -t todo-list .

# Run containers (basic)
docker run hello-world-python
docker run -it basic-calculator
docker run -it todo-list
```

### **To-Do List Persistent Storage Commands**
```bash
# Create data directory
mkdir data

# Copy initial tasks
copy tasks.json data\tasks.json

# Build with persistence support
docker build -f Dockerfile_TodoList -t todo-list-v4 .

# Run with volume mounting (Windows PowerShell)
docker run -it -v "${PWD}/data:/app/data" -e TASK_FILE="/app/data/tasks.json" todo-list-v4

# Alternative using helper script
run_todo_docker.bat

# Verify persistence
type data\tasks.json
```

### **Git Commands Used**
```bash
# Initialize repository
git init

# Stage and commit changes
git add .
git commit -m "commit message"

# Check status and history
git status
git log --oneline

# File operations
move sample_tasks.json tasks.json
dir *.json
```

## 🔧 **Problem-Solving Sequence**

### **Issue 1: Sample Tasks Not Loading**
- **Problem**: `sample_tasks.json not working`
- **Root Cause**: File name mismatch (app looked for `tasks.json`)
- **Solution**: Renamed file and updated Dockerfile
- **Commands**:
  ```bash
  move sample_tasks.json tasks.json
  docker build -f Dockerfile_TodoList -t todo-list-v3 .
  ```

### **Issue 2: Docker Container Not Persisting Changes**
- **Problem**: `task.json not update`
- **Root Cause**: Ephemeral container storage
- **Solution**: Volume mounting with environment variables
- **Commands**:
  ```bash
  mkdir data
  copy tasks.json data\tasks.json
  docker run -it -v "${PWD}/data:/app/data" -e TASK_FILE="/app/data/tasks.json" todo-list-v4
  ```

### **Issue 3: Data Loss Prevention**
- **Problem**: `save to do list in json ... to prevent data lost`
- **Solution**: Auto-save after every operation + signal handlers
- **Implementation**: Modified `todo_list.py` with:
  - Automatic JSON saving after add/complete/delete operations
  - Signal handlers for SIGINT/SIGTERM
  - Enhanced error handling

## 📁 **File Structure Evolution**

### **Initial Structure**
```
├── hello_world.py
├── README.md
├── .gitignore
└── Dockerfile
```

### **After Calculator Addition**
```
├── hello_world.py
├── calculator.py
├── calculator_simple.py
├── README.md
├── README_Calculator.md
├── Dockerfile
├── Dockerfile_Calculator
└── .gitignore
```

### **Final Structure (To-Do List Complete)**
```
├── hello_world.py
├── calculator.py
├── calculator_simple.py
├── todo_list.py
├── todo_simple.py
├── README.md
├── README_Calculator.md
├── README_TodoList.md
├── roadmap.md
├── Dockerfile
├── Dockerfile_Calculator
├── Dockerfile_TodoList
├── run_todo_docker.bat
├── tasks.json
├── sample_tasks.json
├── data/
│   └── tasks.json (persistent)
└── .gitignore
```

## 🎯 **Key Learning Points**

### **Docker Persistence Patterns**
1. **Volume Mounting**: `-v host_path:container_path`
2. **Environment Variables**: `-e VAR_NAME=value`
3. **Interactive Mode**: `-it` flag for user input
4. **File Inclusion**: Update Dockerfile with `COPY` commands

### **Python Application Patterns**
1. **Auto-Save**: Save after every data modification
2. **Signal Handling**: Graceful shutdown with `signal` module
3. **Environment Configuration**: Use `os.environ.get()`
4. **Error Handling**: Try-except blocks for file operations

### **Development Workflow**
1. **Incremental Development**: Build → Test → Fix → Document
2. **Problem Documentation**: Record issues and solutions
3. **Command Preservation**: Save all working commands
4. **Version Control**: Commit frequently with descriptive messages

## 📚 **Documentation Philosophy**

This project demonstrates the importance of:
- **Prompt Preservation**: Keeping exact prompts for reproducibility
- **Command Documentation**: Saving all working commands
- **Problem-Solution Mapping**: Documenting issues and their fixes
- **Progressive Enhancement**: Building features incrementally
- **Version Control**: Tracking all changes with meaningful commits

## 🚀 **Next Steps Preparation**

Based on the roadmap, the next projects would involve:
- **Number Guessing Game**: Random module, game logic
- **File Reader**: Advanced file I/O operations
- **Student Gradebook**: Dictionary data structures
- **Weather App**: API integration, HTTP requests

Each project will follow the same documentation pattern established here.

---

*This document serves as a complete reference for recreating the development process and understanding the problem-solving approach used throughout the Python learning project sequence.*
