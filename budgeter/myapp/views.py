from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .externalapis.overpass import nearby_stores 
from myapp.handlers.receipt_handler import ReceiptHandler
from .serializers import GoalSerializer
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

@api_view(['GET'])
def sample_api(request):
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
    user = request.user
    amount = request.GET.get('amount')
    category = request.GET.get('category')
    
    # Normalize the category input to title case
    category = category.title() if category else None
    
    if category not in SpendingType.values:
        return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)

    date = request.GET.get('date')
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
    for category, amount in grouped_res.items():
        transaction = Transaction(
            user=user,
            amount=amount,
            date=timezone.now(),
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
def add_goal(request):
    serializer = GoalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['GET'])
def list_goals(request):
    goals = Goal.objects.all()
    serializer = GoalSerializer(goals, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def remove_goal(request, id):
    try:
        goal = Goal.objects.get(id=id)  # Get the goal by ID
        goal.delete()  # Delete the goal from the database
        return Response({'error': 'None'})
    except Goal.DoesNotExist:
        return Response({'error': 'Goal not found'})

@api_view(['POST'])
def google_auth(request):
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
    user = request.user
    start = request.GET.get('start')
    end = request.GET.get('end')
    start_date = timezone.make_aware(datetime.strptime(start, '%Y-%m-%d'), timezone.get_current_timezone())
    end_date = timezone.make_aware(datetime.strptime(end, '%Y-%m-%d'), timezone.get_current_timezone())
    
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
    print(summary)
    print(date_summary)
    return Response({'summary': summary, 'date_summary': date_summary, 'error': 'None'})
    
    
