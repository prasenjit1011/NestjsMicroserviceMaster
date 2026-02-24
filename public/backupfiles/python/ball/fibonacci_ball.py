import turtle
import time

screen = turtle.Screen()
screen.bgcolor("black")
screen.title("Fibonacci Ball Breaker")

ball = turtle.Turtle()
ball.shape("circle")
ball.color("cyan")
ball.penup()
ball.goto(-200, -200)
ball.speed(1)

wall_layers = []
num_layers = 7
layer_spacing = 50

for i in range(num_layers):
    wall = turtle.Turtle()
    wall.hideturtle()
    wall.color("white")
    wall.penup()
    wall.goto(-250, -200 + i * layer_spacing)
    wall.pendown()
    wall.forward(500)
    wall_layers.append(wall)

def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

for i in range(1, num_layers + 1):
    step = fibonacci(i) * 2
    ball.forward(step)
    ball.sety(-200 + i * layer_spacing)
    ball.stamp()
    time.sleep(0.5)

ball.hideturtle()
screen.mainloop()