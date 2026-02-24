from direct.showbase.ShowBase import ShowBase
from panda3d.core import Point3

class CarRacingGame(ShowBase):
    def __init__(self):
        ShowBase.__init__(self)
        self.disableMouse()
        self.setBackgroundColor(0.1, 0.1, 0.2)
        # Load a simple car model (use built-in model for demo)
        self.car = self.loader.loadModel('models/box')
        self.car.setScale(0.5, 1, 0.25)
        self.car.setPos(0, 10, 0)
        self.car.reparentTo(self.render)
        # Camera setup
        self.camera.setPos(0, -20, 6)
        self.camera.lookAt(self.car)
        # Keyboard controls
        self.accept('arrow_left', self.move_left)
        self.accept('arrow_right', self.move_right)
        self.accept('arrow_up', self.move_forward)
        self.accept('arrow_down', self.move_backward)
    def move_left(self):
        self.car.setX(self.car.getX() - 1)
    def move_right(self):
        self.car.setX(self.car.getX() + 1)
    def move_forward(self):
        self.car.setY(self.car.getY() + 1)
    def move_backward(self):
        self.car.setY(self.car.getY() - 1)

if __name__ == '__main__':
    game = CarRacingGame()
    game.run()
