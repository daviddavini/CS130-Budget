from myapp.visualizations.visualization_method import VisualizationMethod

class SpendingHandler:
    def __init__(self):
        self.visualizations = []
        
    def analyze_spendings(self, start_date, end_date, spending):
        res = []
        for method in self.visualizations:
            res.append(method.create_visualization(spending))
        return res

    def find_spending_records(self, start_date, end_date):
        pass

    def add_visualization(self, visual_method: VisualizationMethod):
        self.visualizations.append(visual_method)
        

    def remove_visualization(self, visual_method: VisualizationMethod):
        self.visualizations.remove(visual_method)
