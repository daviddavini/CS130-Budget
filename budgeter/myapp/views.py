from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .externalapis.overpass import nearby_stores 
from myapp.handlers.receipt_handler import ReceiptHandler
from .serializers import GoalSerializer

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
