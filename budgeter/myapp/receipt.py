from spending import SpendingComponent
class ReceiptInfo:
    def __init__(self, receipt_id: str, location: str, date, composite):
        self.id = receipt_id
        self.location = location
        self.date = date
        self.spending_items = composite

    def add_item(self, item: SpendingComponent):
        self.spending_items.add(item)

    def delete_item(self, item: SpendingComponent):
        self.spending_items.remove(item)
