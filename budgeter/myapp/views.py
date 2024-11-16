from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .externalapis.overpass import nearby_stores 
from myapp.handlers.receipt_handler import ReceiptHandler


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
    return receipt_handler.scan_receipt(self, image)
