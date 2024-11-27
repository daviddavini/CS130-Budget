from account import UserAccount, AccountProxy
class User:
    def __init__(self, name: str, email: str, username, password):
        self.name = name
        self.email = email
        acc = UserAccount(username, password)
        self.account = AccountProxy(acc)
        
