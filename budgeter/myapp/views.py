from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .externalapis.overpass import nearby_stores 
from myapp.handlers.receipt_handler import ReceiptHandler
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from django.contrib.auth import login
from rest_framework.authtoken.models import Token

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
    return Response({"results": nodes})

@api_view(['POST'])
def receipt_scanning(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided'})

    image = request.FILES['image']
    
    receipt_handler = ReceiptHandler(settings.OCR_API_KEY)
    return Response(receipt_handler.scan_receipt(image))

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