#!/usr/bin/env python3
"""
Number Guessing Game
A fun interactive game where the player tries to guess a randomly generated number.
"""

import random
import sys
import signal

class NumberGuessingGame:
    """A Number Guessing Game with multiple difficulty levels and statistics"""
    
    def __init__(self):
        """Initialize the game"""
        self.stats = {
            'games_played': 0,
            'games_won': 0,
            'total_guesses': 0,
            'best_score': float('inf')
        }
        
        # Set up signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
    
    def signal_handler(self, sig, frame):
        """Handle interrupt signals"""
        print(f"\n\n🎯 Game interrupted! Thanks for playing!")
        self.show_final_stats()
        sys.exit(0)
    
    def display_welcome(self):
        """Display welcome message and game rules"""
        print("\n" + "="*60)
        print("🎯           WELCOME TO NUMBER GUESSING GAME           🎯")
        print("="*60)
        print("🎮 Game Rules:")
        print("   • I'll think of a number, you try to guess it!")
        print("   • I'll give you hints: 'Too High' or 'Too Low'")
        print("   • Try to guess in as few attempts as possible!")
        print("   • Choose your difficulty level for different ranges")
        print("="*60)
    
    def display_menu(self):
        """Display the main game menu"""
        print("\n" + "="*50)
        print("               GAME MENU")
        print("="*50)
        print("1. 🟢 Easy (1-50)")
        print("2. 🟡 Medium (1-100)")
        print("3. 🔴 Hard (1-500)")
        print("4. 🚀 Expert (1-1000)")
        print("5. 🎲 Custom Range")
        print("6. 📊 View Statistics")
        print("7. 🔄 Reset Statistics")
        print("8. ❓ How to Play")
        print("9. 🚪 Exit Game")
        print("="*50)
    
    def get_difficulty_settings(self, choice):
        """Get range settings based on difficulty choice"""
        settings = {
            '1': {'min': 1, 'max': 50, 'name': 'Easy', 'emoji': '🟢'},
            '2': {'min': 1, 'max': 100, 'name': 'Medium', 'emoji': '🟡'},
            '3': {'min': 1, 'max': 500, 'name': 'Hard', 'emoji': '🔴'},
            '4': {'min': 1, 'max': 1000, 'name': 'Expert', 'emoji': '🚀'}
        }
        
        if choice in settings:
            return settings[choice]
        elif choice == '5':
            return self.get_custom_range()
        else:
            return None
    
    def get_custom_range(self):
        """Get custom range from user"""
        try:
            print("\n🎲 Custom Range Setup:")
            min_num = int(input("Enter minimum number: "))
            max_num = int(input("Enter maximum number: "))
            
            if min_num >= max_num:
                print("❌ Minimum must be less than maximum!")
                return None
            
            return {
                'min': min_num,
                'max': max_num,
                'name': 'Custom',
                'emoji': '🎲'
            }
        except ValueError:
            print("❌ Please enter valid numbers!")
            return None
    
    def get_valid_guess(self, min_num, max_num):
        """Get a valid guess from the user"""
        while True:
            try:
                guess = input(f"\n🎯 Enter your guess ({min_num}-{max_num}): ").strip()
                
                # Allow quit command
                if guess.lower() in ['quit', 'exit', 'q']:
                    return None
                
                guess_num = int(guess)
                
                if min_num <= guess_num <= max_num:
                    return guess_num
                else:
                    print(f"❌ Please enter a number between {min_num} and {max_num}!")
            except ValueError:
                print("❌ Please enter a valid number!")
    
    def calculate_max_guesses(self, range_size):
        """Calculate optimal number of guesses for binary search"""
        import math
        return math.ceil(math.log2(range_size)) + 2
    
    def play_game(self, settings):
        """Play a single game with given settings"""
        min_num = settings['min']
        max_num = settings['max']
        difficulty = settings['name']
        emoji = settings['emoji']
        
        # Generate random number
        secret_number = random.randint(min_num, max_num)
        attempts = 0
        max_attempts = self.calculate_max_guesses(max_num - min_num + 1)
        
        print(f"\n{emoji} Starting {difficulty} Mode!")
        print(f"🎯 I'm thinking of a number between {min_num} and {max_num}")
        print(f"💡 Hint: Try to guess it in {max_attempts} attempts or less!")
        print("💬 Type 'quit' anytime to return to menu")
        
        game_start_time = True
        
        while True:
            attempts += 1
            
            # Show attempt counter
            if attempts <= max_attempts:
                print(f"\n📍 Attempt {attempts}/{max_attempts}")
            else:
                print(f"\n📍 Attempt {attempts} (Bonus round!)")
            
            guess = self.get_valid_guess(min_num, max_num)
            
            # Check if user wants to quit
            if guess is None:
                print("🔙 Returning to main menu...")
                return False
            
            # Check the guess
            if guess == secret_number:
                self.handle_correct_guess(attempts, max_attempts, difficulty)
                return True
            elif guess < secret_number:
                self.give_hint("low", guess, secret_number, min_num, max_num)
            else:
                self.give_hint("high", guess, secret_number, min_num, max_num)
            
            # Give encouragement based on attempts
            if attempts == max_attempts:
                print("⚡ Bonus round! Keep trying!")
            elif attempts > max_attempts + 5:
                offer_hint = input("🤔 Need a hint? (y/n): ").strip().lower()
                if offer_hint == 'y':
                    self.give_special_hint(secret_number, min_num, max_num)
    
    def give_hint(self, direction, guess, secret, min_num, max_num):
        """Give hint based on the guess"""
        if direction == "low":
            print(f"📈 Too Low! The number is higher than {guess}")
        else:
            print(f"📉 Too High! The number is lower than {guess}")
        
        # Calculate remaining range
        if direction == "low":
            remaining = max_num - guess
        else:
            remaining = guess - min_num
        
        if remaining <= 10:
            print(f"🔥 You're getting close! Only {remaining} numbers left in that direction!")
    
    def give_special_hint(self, secret, min_num, max_num):
        """Give a special hint when player is struggling"""
        range_size = max_num - min_num + 1
        quarter = range_size // 4
        
        if secret <= min_num + quarter:
            print(f"💡 Special Hint: The number is in the lower quarter ({min_num}-{min_num + quarter})")
        elif secret <= min_num + 2 * quarter:
            print(f"💡 Special Hint: The number is in the second quarter ({min_num + quarter + 1}-{min_num + 2 * quarter})")
        elif secret <= min_num + 3 * quarter:
            print(f"💡 Special Hint: The number is in the third quarter ({min_num + 2 * quarter + 1}-{min_num + 3 * quarter})")
        else:
            print(f"💡 Special Hint: The number is in the upper quarter ({min_num + 3 * quarter + 1}-{max_num})")
    
    def handle_correct_guess(self, attempts, max_attempts, difficulty):
        """Handle when player guesses correctly"""
        print(f"\n🎉 CONGRATULATIONS! 🎉")
        print(f"✅ You guessed it in {attempts} attempts!")
        
        # Performance feedback
        if attempts <= max_attempts // 2:
            print("🏆 AMAZING! You're a guessing master!")
        elif attempts <= max_attempts:
            print("👏 EXCELLENT! Great guessing skills!")
        elif attempts <= max_attempts + 2:
            print("👍 GOOD JOB! Nice persistence!")
        else:
            print("🎯 SUCCESS! Never give up!")
        
        # Update statistics
        self.stats['games_played'] += 1
        self.stats['games_won'] += 1
        self.stats['total_guesses'] += attempts
        
        if attempts < self.stats['best_score']:
            self.stats['best_score'] = attempts
            print("🌟 NEW BEST SCORE! 🌟")
        
        # Play again option
        play_again = input("\n🎮 Play another round? (y/n): ").strip().lower()
        return play_again in ['y', 'yes']
    
    def show_statistics(self):
        """Display game statistics"""
        print("\n📊 GAME STATISTICS")
        print("="*40)
        print(f"🎮 Games Played: {self.stats['games_played']}")
        print(f"🏆 Games Won: {self.stats['games_won']}")
        
        if self.stats['games_played'] > 0:
            win_rate = (self.stats['games_won'] / self.stats['games_played']) * 100
            print(f"📈 Win Rate: {win_rate:.1f}%")
        
        if self.stats['games_won'] > 0:
            avg_guesses = self.stats['total_guesses'] / self.stats['games_won']
            print(f"🎯 Average Guesses: {avg_guesses:.1f}")
            
        if self.stats['best_score'] != float('inf'):
            print(f"⭐ Best Score: {self.stats['best_score']} guesses")
        else:
            print("⭐ Best Score: Not set yet")
    
    def reset_statistics(self):
        """Reset all game statistics"""
        confirm = input("⚠️ Are you sure you want to reset all statistics? (yes/no): ").strip().lower()
        if confirm == 'yes':
            self.stats = {
                'games_played': 0,
                'games_won': 0,
                'total_guesses': 0,
                'best_score': float('inf')
            }
            print("🔄 Statistics reset successfully!")
        else:
            print("❌ Reset cancelled.")
    
    def show_how_to_play(self):
        """Display detailed game instructions"""
        print("\n❓ HOW TO PLAY")
        print("="*50)
        print("🎯 Objective:")
        print("   • Guess the secret number in as few attempts as possible")
        print()
        print("🎮 Game Flow:")
        print("   1. Choose difficulty level (Easy, Medium, Hard, Expert, or Custom)")
        print("   2. I'll think of a random number in that range")
        print("   3. Enter your guess")
        print("   4. I'll tell you if it's 'Too High' or 'Too Low'")
        print("   5. Keep guessing until you find the number!")
        print()
        print("💡 Tips:")
        print("   • Use binary search strategy (start in the middle)")
        print("   • Pay attention to the hints to narrow down the range")
        print("   • Try to beat the optimal number of guesses")
        print("   • Type 'quit' during any game to return to menu")
        print()
        print("🏆 Scoring:")
        print("   • Fewer guesses = Better score")
        print("   • Your best score is saved")
        print("   • Win rate and average guesses are tracked")
    
    def show_final_stats(self):
        """Show final statistics when exiting"""
        if self.stats['games_played'] > 0:
            print("\n🎊 FINAL GAME SUMMARY 🎊")
            self.show_statistics()
        print("\n👋 Thanks for playing Number Guessing Game!")
        print("💫 Keep practicing your guessing skills!")
    
    def run(self):
        """Main game loop"""
        self.display_welcome()
        
        while True:
            self.display_menu()
            
            try:
                choice = input("\n🎯 Enter your choice (1-9): ").strip()
                
                if choice == '9':
                    self.show_final_stats()
                    break
                elif choice == '6':
                    self.show_statistics()
                elif choice == '7':
                    self.reset_statistics()
                elif choice == '8':
                    self.show_how_to_play()
                elif choice in ['1', '2', '3', '4', '5']:
                    settings = self.get_difficulty_settings(choice)
                    if settings:
                        continue_playing = True
                        while continue_playing:
                            game_won = self.play_game(settings)
                            if game_won:
                                continue_playing = self.handle_correct_guess(0, 0, settings['name'])
                            else:
                                continue_playing = False
                else:
                    print("❌ Invalid choice! Please select 1-9.")
                
                # Pause before showing menu again
                if choice != '9':
                    input("\n📱 Press Enter to continue...")
                
            except KeyboardInterrupt:
                print("\n\n🎯 Game interrupted!")
                self.show_final_stats()
                break
            except Exception as e:
                print(f"❌ An error occurred: {e}")


def main():
    """Main function to run the Number Guessing Game"""
    game = NumberGuessingGame()
    game.run()


if __name__ == "__main__":
    main()
