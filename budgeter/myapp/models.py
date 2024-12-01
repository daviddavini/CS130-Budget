from django.db import models
from django.contrib.auth.models import User


class SpendingType(models.TextChoices):
    Housing = "Housing"
    Transportation = "Transportation"
    Food = "Food"
    Utilities = "Utilities"
    Medical = "Medical"
    Insurance = "Insurance"
    Education = "Education"
    Entertainment = "Entertainment"
    Clothing = "Clothing"
    PersonalCare = "Personal Care"
    Pet = "Pet"
    Travel = "Travel"
    Gifting = "Gifting"
    Misc = "Misc"

# Create your models here.
class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField()
    spending_type = models.CharField(
        max_length=15,
        choices=SpendingType.choices,
        default=SpendingType.Misc
        )
    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.date} - {self.spending_type}"
    
class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    spending_type = models.CharField(
        max_length = 15,
        choices=SpendingType.choices,
        default=SpendingType.Misc
        )
