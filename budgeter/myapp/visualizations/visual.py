from abc import ABC, abstractmethod
import json

class Visual(ABC):
    @abstractmethod
    def renderInfo(self):
        pass

class TextVisual(Visual):
    def __init__(self, info):
        self.info = info
        
    def renderInfo(self):
        return self.info

class GraphVisual(Visual):
    def __init__(self, info):
        self.info = info
        
    def renderInfo(self):
        return json.dumps(self.info)
