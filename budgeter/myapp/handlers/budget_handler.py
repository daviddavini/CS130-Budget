from myapp.spending import SpendingComposite, SpendingComponent
from myapp.observers.publisher import Publisher

class BudgetHandler(Publisher):
    def __init__(self, spending: SpendingComposite, date):
        self.spendings = spending
        self.start_date = date
        self.last_mod = date

    def make_spending_goal(self, user, amount, start_date, end_date, spending_type):
        goal = Goal(
            user=user,
            amount=amount,
            start_date=start_date,
            end_date=end_date,
            spending_type=spending_type
            )
        goal.save()
        super().add_goal(goal)
        return goal

    def finish_spending_goal(self, goal):
        super().remove_goal(goal)
        goal.delete()

    def add_spendings(self, component: SpendingComponent):
        self.spendings.add(component)
        super().notify_all()

    def remove_spendings(self, component: SpendingComponent):
        self.spendings.remove(component)
        super().notify_all()
