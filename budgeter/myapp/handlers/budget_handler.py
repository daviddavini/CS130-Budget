from myapp.spending import SpendingComposite, SpendingComponent
from myapp.observers.publisher import Publisher

class BudgetHandler(Publisher):
    def __init__(self, spending: SpendingComposite, date):
        self.spendings = spending
        self.start_date = date
        self.last_mod = date

    def make_spending_goal(self, goal):
        super().add_goal(goal)

    def finish_spending_goal(self, goal):
        super().remove_goal(goal)

    def add_spendings(self, component: SpendingComponent):
        self.spendings.add(component)
        super().notify_all()

    def remove_spendings(self, component: SpendingComponent):
        self.spendings.remove(component)
        super().notify_all()
