class UserAccount():
    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.location = ""  

    def visualize_spendings(self, start_date, end_date):
        pass

    def update_budget(self, date, amount):
        pass

    def initiate_scan(self, image):
        pass

    def reset_budget(self):
        pass

    def update_location(self, location):
        self.location = location

class AccountProxy():
    def __init__(self, account: UserAccount):
        self.account = account
        self.check = True

    def check_permissions(self):
        pass

    def update_location(self):
        if self.check:
            if not self.check_permissions():
                return False
        return self.account.update_location()

    def enable_check(self, yes):
        self.check = yes

    def visualize_spendings(self, start_date, end_date):
        return self.account.visualize_spendings(start_date, end_date)

    def update_budget(self, date, amount):
        return self.account.update_budget(date, amount)

    def initiate_scan(self, image):
        return self.account.initiate_scan(image)

    def reset_budget(self):
        return self.account.reset_budget()
