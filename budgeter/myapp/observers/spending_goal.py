from .publisher import Publisher
from .observer import Observer

class PublisherSubscriber(Observer):
    def __init__(self):
        self.publisher = Publisher()

    def update(self, budget):
        self.publisher.notify_all()
        pass

    
    
