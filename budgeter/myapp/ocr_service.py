import requests
from django.conf import settings

class OCRHandler():
    
    def __init__(self):
        pass

    def parse_receipt_image(self, image_path):
        """
        uses OCRSpace API to obtain text from image, returns json documenting text lines and their positions in image.
        """
        api_url = "https://api.ocr.space/parse/image"
        payload = {'apikey': settings.OCR_API_KEY, 
                'isOverlayRequired': 'true', 
                'language': 'eng'}

        with open(image_path, 'rb') as image_file:
            response = requests.post(api_url, files={'file': image_file}, data=payload)
        
        return response.json()
