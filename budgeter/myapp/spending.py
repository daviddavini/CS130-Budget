from models import SpendingType

class SpendingComponent:
    def __init__(self, type: SpendingType, amount: float):
        self.type = type
        self.amount = amount
        
    def get_amount(self) -> float:
        return self.amount
    
    def get_spending_type(self) -> SpendingType:
        return self.type

class SpendingComposite(SpendingComponent):
    def __init__(self, type: SpendingType, amount: float):
        super().__init__(type, amount)
        self.children = []

    def add(self, component: SpendingComponent):
        self.children.append(component)

    def remove(self, component: SpendingComponent):
        self.children.remove(component)

    def get_children(self):
        return self.children

    def get_amount(self):
        total = self.amount
        for component in self.children:
            total += component.get_amount()
        return total

class SpendingItem(SpendingComponent):
    def __init__(self, type: SpendingType, amount: float):
        super().__init__(type, amount)

