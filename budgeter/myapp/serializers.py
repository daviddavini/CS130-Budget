from rest_framework import serializers
from .models import Goal
from django.utils import timezone
import datetime
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate

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

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {
            'username': {
                'validators': [UniqueValidator(queryset=User.objects.all())],  # Ensure username is unique
                'max_length': 150,  # Set max length if needed
            },
            'password': {'write_only': True},  # Password should not be returned in responses
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user
    
    def validate_username(self, value):
        """Check that the username is not already taken."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")
        
        attrs['user'] = user  # Store the authenticated user
        return attrs
