# Number Guessing Game Python Project

An interactive number guessing game where players try to guess a randomly generated number with hints and multiple difficulty levels.

## Description

This project demonstrates essential Python programming concepts including:
- **Random Module**: Generating random numbers for game mechanics
- **Loops**: Game loop, input validation, and retry mechanisms
- **Conditionals**: Game logic, hint generation, and difficulty settings
- **Functions**: Modular game components and reusable code
- **Input Validation**: Handling user input and errors gracefully
- **Statistics Tracking**: Game performance and scoring systems
- **Signal Handling**: Graceful shutdown and game state management
- **Classes**: Object-oriented game structure and state management

## Files

- `number_guessing_game.py` - Full-featured game with multiple difficulty levels and statistics
- `number_guessing_simple.py` - Simplified version focusing on core concepts
- `README_NumberGuessing.md` - This documentation file
- `Dockerfile_NumberGuessing` - Docker configuration for containerized play

## Features

### Full-Featured Game (`number_guessing_game.py`)
- 🎯 **Multiple Difficulty Levels**: Easy (1-50), Medium (1-100), Hard (1-500), Expert (1-1000)
- 🎲 **Custom Range**: Set your own min/max numbers
- 📊 **Statistics Tracking**: Games played, win rate, average guesses, best score
- 💡 **Smart Hints**: Directional hints with proximity feedback
- 🆘 **Special Hints**: Quarter-range hints when struggling
- 🏆 **Performance Feedback**: Scoring based on optimal guess calculations
- 🔄 **Persistent Sessions**: Play multiple rounds with running statistics
- ❓ **How to Play Guide**: Complete instructions and strategy tips
- 🚪 **Graceful Exit**: Signal handling and final statistics

### Simple Game (`number_guessing_simple.py`)
- Basic 1-100 range guessing
- 10 attempt limit
- Simple too high/too low feedback
- Input validation
- Core learning concepts demonstration

## How to Run

### Option 1: Run the Full Game
```bash
python number_guessing_game.py
```

### Option 2: Run the Simple Version
```bash
python number_guessing_simple.py
```

### Option 3: Run with Docker
```bash
# Build the image
docker build -f Dockerfile_NumberGuessing -t number-guessing-game .

# Run the game (interactive mode)
docker run -it number-guessing-game
```

## Sample Gameplay

```
🎯           WELCOME TO NUMBER GUESSING GAME           🎯
==============================================================
🎮 Game Rules:
   • I'll think of a number, you try to guess it!
   • I'll give you hints: 'Too High' or 'Too Low'
   • Try to guess in as few attempts as possible!
   • Choose your difficulty level for different ranges

               GAME MENU
==================================================
1. 🟢 Easy (1-50)
2. 🟡 Medium (1-100)
3. 🔴 Hard (1-500)
4. 🚀 Expert (1-1000)
5. 🎲 Custom Range
6. 📊 View Statistics
7. 🔄 Reset Statistics
8. ❓ How to Play
9. 🚪 Exit Game

🎯 Enter your choice (1-9): 2

🟡 Starting Medium Mode!
🎯 I'm thinking of a number between 1 and 100
💡 Hint: Try to guess it in 9 attempts or less!

📍 Attempt 1/9
🎯 Enter your guess (1-100): 50
📉 Too High! The number is lower than 50

📍 Attempt 2/9
🎯 Enter your guess (1-100): 25
📈 Too Low! The number is higher than 25

📍 Attempt 3/9
🎯 Enter your guess (1-100): 37
📈 Too Low! The number is higher than 37
🔥 You're getting close! Only 12 numbers left in that direction!

📍 Attempt 4/9
🎯 Enter your guess (1-100): 43
📉 Too High! The number is lower than 43

📍 Attempt 5/9
🎯 Enter your guess (1-100): 40

🎉 CONGRATULATIONS! 🎉
✅ You guessed it in 5 attempts!
👏 EXCELLENT! Great guessing skills!
🌟 NEW BEST SCORE! 🌟
```

## Learning Objectives

After completing this project, students will understand:

### Core Concepts
1. **Random Module**: Using `random.randint()` for game mechanics
2. **Game Loops**: Implementing continuous gameplay with proper exit conditions
3. **Conditional Logic**: Complex decision trees for game flow
4. **Input Validation**: Handling user input errors and edge cases
5. **Loop Control**: Using `break`, `continue`, and `else` clauses

### Advanced Concepts
6. **Statistics Management**: Tracking and calculating game performance
7. **Signal Handling**: Graceful shutdown and interruption management
8. **Object-Oriented Design**: Game state encapsulation and methods
9. **Algorithm Implementation**: Binary search strategy hints
10. **User Experience**: Feedback systems and difficulty balancing

## Game Strategy

### Optimal Playing Strategy
1. **Binary Search Approach**: Start with the middle of the range
2. **Range Halving**: Each guess should eliminate half the remaining possibilities
3. **Mathematical Optimal**: For range 1-N, optimal guesses = log₂(N) + 2

### Difficulty Analysis
- **Easy (1-50)**: Optimal = 8 guesses
- **Medium (1-100)**: Optimal = 9 guesses  
- **Hard (1-500)**: Optimal = 11 guesses
- **Expert (1-1000)**: Optimal = 12 guesses

## Project Progression

This project builds on previous concepts:
- **Project 1 (Hello World)**: Basic syntax and output
- **Project 2 (Calculator)**: Variables, input, functions
- **Project 3 (To-Do List)**: Lists, loops, conditionals
- **Project 4 (Number Guessing)**: **Random module, game logic** ← Current project

And prepares for upcoming projects:
- **Project 5 (File Reader)**: File I/O operations
- **Project 6 (Student Gradebook)**: Dictionary data structures

## Requirements

- Python 3.x
- Docker (optional, for containerized execution)
- No external dependencies required

## Project Creation Prompts

This Number Guessing Game project was created using the following prompts with GitHub Copilot:

1. **Initial Request**: "create project : Number Guessing Game"
   - Created the full-featured number guessing game (`number_guessing_game.py`)
   - Added a simplified version for beginners (`number_guessing_simple.py`)
   - Implemented comprehensive documentation (`README_NumberGuessing.md`)
   - Added Docker support for containerized execution
   - Included multiple difficulty levels and statistics tracking
   - Implemented smart hint system and performance feedback

## Author

Created as part of a Python learning roadmap, demonstrating the progression from basic data structures to game logic and random number generation using GitHub Copilot assistance.
