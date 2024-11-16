from .observer import Observer

class Publisher:
    def __init__(self):
        self.observers = []

    def notify_all(self):
        for observer in self.observers:
            observer.update(self)

    def add_goal(self, ob: Observer):
        self.observers.append(ob)

    def remove_goal(self, ob: Observer):
        self.observers.remove(ob)
        
    
    
