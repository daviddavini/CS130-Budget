from rest_framework import serializers
from .models import Goal
from django.utils import timezone
import datetime
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate

# to create new users
class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {
            'username': {
                # ensuring no duplicate user names
                'validators': [UniqueValidator(queryset=User.objects.all())],  # Ensure username is unique
                'max_length': 150,  # Set max length if needed
            },
            'password': {'write_only': True},  # Password should not be returned in responses
        }

    def create(self, validated_data):
        """
        Creates a new user instance.

        **Important:** The password will be hashed before saving.

        :param validated_data: The validated data containing the username and password.
        :return: The created user instance.
        
        Usage example:
        
        >>> serializer = SignUpSerializer(data={'username': 'newuser', 'password': 'mypassword'})
        >>> if serializer.is_valid():
        ...     user = serializer.save()
        """
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user
    
    def validate_username(self, value):
        """
        Check that the username is not already taken.

        :param value: The username to validate.
        :raises serializers.ValidationError: If the username is already taken.
        :return: The validated username.
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

# to log in existing users
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        """
        Validate the login credentials.

        :param attrs: The dictionary containing username and password.
        :raises serializers.ValidationError: If the credentials are invalid.
        :return: The validated attributes including the authenticated user.
        
        Usage example:
        
        >>> serializer = LoginSerializer(data={'username': 'existinguser', 'password': 'mypassword'})
        >>> if serializer.is_valid():
        ...     user = serializer.validated_data['user']
        """
        username = attrs.get('username')
        password = attrs.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")
        
        attrs['user'] = user  # Store the authenticated user
        return attrs
