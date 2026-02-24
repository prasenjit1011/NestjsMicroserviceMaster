#!/usr/bin/env python3
"""
Simple Number Guessing Game - Beginner Version
A basic number guessing game for learning Python fundamentals.
"""

import random

def main():
    """Simple number guessing game"""
    print("=== Simple Number Guessing Game ===")
    print("I'm thinking of a number between 1 and 100.")
    print("Try to guess it!")
    
    # Generate random number
    secret_number = random.randint(1, 100)
    attempts = 0
    max_attempts = 10
    
    while attempts < max_attempts:
        try:
            # Get user guess
            guess = int(input(f"\nAttempt {attempts + 1}/{max_attempts} - Enter your guess: "))
            attempts += 1
            
            # Check the guess
            if guess == secret_number:
                print(f"\n🎉 Congratulations! You guessed it!")
                print(f"The number was {secret_number}")
                print(f"It took you {attempts} attempts.")
                break
            elif guess < secret_number:
                print("Too low! Try a higher number.")
            else:
                print("Too high! Try a lower number.")
                
        except ValueError:
            print("Please enter a valid number!")
            # Don't count invalid input as an attempt
            attempts -= 1
    
    else:
        # This runs if the loop completes without breaking
        print(f"\n😔 Sorry! You've used all {max_attempts} attempts.")
        print(f"The number was {secret_number}")
    
    print("\nThanks for playing!")


if __name__ == "__main__":
    main()
