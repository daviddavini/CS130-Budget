from django.db import models


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
    PersonalCare = "PersonalCare"
    Pet = "Pet"
    Travel = "Travel"
    Gifting = "Gifting"
    Misc = "Misc"

# Create your models here.
class Transaction(models.Model):
    user = models.CharField(max_length=30)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255)
    spending_type = models.CharField(
        max_length=15,
        choices=SpendingType.choices,
        default=SpendingType.Misc
        )
    
class Goal(models.Model):
    user = models.CharField(max_length=30)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    spending_type = models.CharField(
        max_length = 15,
        choices=SpendingType.choices,
        default=SpendingType.Misc
        )
