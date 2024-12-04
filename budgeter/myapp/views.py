from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .externalapis.overpass import nearby_stores 
from myapp.handlers.receipt_handler import ReceiptHandler
from .serializers import SignUpSerializer, LoginSerializer
from .categorizer import Categorizer
from .models import SpendingType, Goal, Transaction
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from django.contrib.auth import login
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.utils import timezone
from datetime import datetime
from .externalapis.wikidata import get_business_info

import json

@api_view(['POST'])
def manual_auth(request):
    """
    Create new user account based on signup information and returns user token
    """
    # parse binary data into json
    decoded = request.body.decode('utf-8')
    try:
        data = json.loads(decoded)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        serializer = SignUpSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_view(request):
    """
    Log in existing user based on given username and password and returns user token
    """
    # parse binary data into json
    decoded = request.body.decode('utf-8')
    try:
        data = json.loads(decoded)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        serializer = LoginSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def sample_api(request):
    """
    Overpass and wikidata API to obtain nearby stores information
    """
    radius = request.GET.get('radius')
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    print(lat,lon)
    nodes = nearby_stores(
        radius=radius,
        lat=lat,
        lon=lon,
    )
    for node in nodes:
        wikidata_id = node.get('wikidata') or node.get('brand:wikidata')
        if wikidata_id:
            try:
                business_info = get_business_info(wikidata_id)
                node['business_info'] = business_info
            except Exception as e:
                print(f"Failed to fetch business info for {wikidata_id}: {e}")

    return Response({"results": nodes})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def manual_input(request):
    """
    Logs a single spending (of a single category) into database for the user
    """
    user = request.user
    amount = request.GET.get('amount')
    category = request.GET.get('category')
    
    # Normalize the category input to title case
    category = category.title() if category else None
    
    if category not in SpendingType.values:
        return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)

    date = request.GET.get('date')
    date = timezone.make_aware(datetime.strptime(date, '%Y-%m-%d'), timezone.get_current_timezone())
    transaction = Transaction(
        user=user,
        amount=amount,
        date=date,
        spending_type=category  # Assuming category matches SpendingType choices
    )
    transaction.save()
    return Response({'error':'None'})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def receipt_scanning(request):
    """
    Logs multiple spendings of possibly varying categories into database
    items obtained from receipt
    categories obtained from Google Gemini API
    date is assumed to be the current date
    """
    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided'})

    image = request.FILES['image']
    user = request.user
    
    receipt_handler = ReceiptHandler(settings.OCR_API_KEY)
    result = receipt_handler.scan_receipt(image)
    categorizer = Categorizer()
    grouped_res = {}
    for key, val in result.items():
        if key != 'Total' and key != 'Subtotal' and key != 'TAX':
            print(key, val)
            category = categorizer.categorize_item(key)
            grouped_res[category] = round(grouped_res.get(category, 0.0) + val, 2)
            print(grouped_res)
    saved_transactions = []
      # Create a transaction for each category
    current_date = datetime.now().date()
    
    for category, amount in grouped_res.items():
        transaction = Transaction(
            user=user,
            amount=amount,
            date=current_date,
            spending_type=category  # Assuming category matches SpendingType choices
        )
        transaction.save()
        saved_transactions.append(transaction.id)

    # Verify saved transactions
    verified_transactions = Transaction.objects.filter(id__in=saved_transactions)
    if len(verified_transactions) == len(saved_transactions):
        return Response({
            'message': 'All transactions saved successfully',
            'transactions': grouped_res,
            'transaction_ids': saved_transactions
        })
    else:
        return Response({
            'error': 'Some transactions were not saved',
            'saved_count': len(verified_transactions),
            'expected_count': len(saved_transactions)
        }, status=400)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def set_goal(request):
    """
    Store spending goals in database for every spending category for the user
    """
    decoded = request.body.decode('utf-8')
    try:
        data = json.loads(decoded)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
    user = request.user
    print(data)
    for category, amount in data:
        Goal.objects.update_or_create(
            user=user,
            spending_type=category,
            defaults={'amount': amount}
        )
    print(Goal.objects.all())
    return Response({'status': 'success'})
    
@api_view(['POST'])
def google_auth(request):
    """
    Authenticate user using google API and returning a jwt token
    """
    token = request.data.get('token')
    if not token:
        return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        CLIENT_ID = '615160098054-au18806m6vc79vc41p4ns0u1824iiplq.apps.googleusercontent.com'
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        email = idinfo['email']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        user, created = User.objects.get_or_create(email=email, defaults={
            'username': email,
            'first_name': first_name,
            'last_name': last_name,
        })

        if not created:
            user.first_name = first_name
            user.last_name = last_name
            user.save()

        login(request, user)
        token_obj, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token_obj.key}, status=status.HTTP_200_OK)

    except ValueError:
        # Invalid token
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except GoogleAuthError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_visualization(request):
    """
    Obtain user's spending information and spending goals from database and return their summary
    summaries are information necessary to create charts in front end
    """
    user = request.user
    start = request.GET.get('start')
    end = request.GET.get('end')
    start_date = timezone.make_aware(datetime.strptime(start, '%Y-%m-%d'), timezone.get_current_timezone())
    end_date = timezone.make_aware(datetime.strptime(end, '%Y-%m-%d'), timezone.get_current_timezone())
    print(start_date, end_date)
    
    transactions = Transaction.objects.filter(user=user)
    print("All user transactions", transactions)
    transactions = transactions.filter(date__range=(start_date, end_date))

    summary = {}
    date_summary = {}
    for transaction in transactions:
        date_key = transaction.date.strftime('%Y-%m-%d')
        values = date_summary.get(date_key, {})
        values[transaction.spending_type] = values.get(transaction.spending_type, 0) + transaction.amount
        date_summary[date_key] = values
        summary[transaction.spending_type] = summary.get(transaction.spending_type, 0) + transaction.amount

    goals = Goal.objects.filter(user=user)
    goal_summary = {goal.spending_type: goal.amount for goal in goals}
    
    return Response({
        'summary': summary,
        'date_summary': date_summary,
        'goal_summary': goal_summary,
        'error': 'None'
    })
    
    
