from abc import ABC, abstractmethod

class VisualizationMethod(ABC):
    @abstractmethod
    def create_visualization(self, spending):
        pass
