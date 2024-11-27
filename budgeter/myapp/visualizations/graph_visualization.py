from .visualization_method import VisualizationMethod

class GraphVisualization(VisualizationMethod):
    def create_visualization(self, spending):
        return self.create_graph(spending)

    def create_graph(self, spending):
        pass

class PieGraph(GraphVisualization):
    def create_graph(self, spending):
        pass

class BarGraph(GraphVisualization):
    def create_graph(self, spending):
        pass
