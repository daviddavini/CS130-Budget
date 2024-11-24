from rest_framework import serializers
from .models import Goal
from django.utils import timezone
import datetime

class AwareDateTimeField(serializers.DateTimeField):
    def to_internal_value(self, data):
        # Convert the input string to a naive datetime object
        naive_datetime = datetime.datetime.strptime(data, "%Y/%m/%d")
        
        # Make it timezone aware using the current timezone
        aware_datetime = timezone.make_aware(naive_datetime, timezone.get_current_timezone())

class GoalSerializer(serializers.ModelSerializer):
    start_date = AwareDateTimeField()
    end_date = AwareDateTimeField()
    class Meta:
        model = Goal
        fields = '__all__'  # Include all fields from the Goal model
