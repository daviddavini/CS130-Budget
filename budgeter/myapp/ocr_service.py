import requests
from django.conf import settings

def parse_receipt_image(image_path):
    api_url = "https://api.ocr.space/parse/image"
    payload = {'apikey': settings.OCR_API_KEY, 
               'isOverlayRequired': 'true', 
               'language': 'eng'}

    with open(image_path, 'rb') as image_file:
        response = requests.post(api_url, files={'file': image_file}, data=payload)
    
    return response.json()