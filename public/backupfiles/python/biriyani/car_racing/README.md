# Simple 3D Car Racing Game (Demo)

This is a minimal Python car racing game using Panda3D. It runs in a window and can be containerized with Docker.

## How to Run Locally

1. Install dependencies:
   ```sh
   pip install panda3d
   ```
2. Run the game:
   ```sh
   python main.py
   ```

## How to Run with Docker

1. Build the image:
   ```sh
   docker build -t car-racing .
   ```
2. Run the container (with display forwarding for GUI):
   ```sh
   docker run -e DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix car-racing
   ```

## Note
- This demo is very basic and for educational purposes.
- For full 3D games, expand assets and logic as needed.
