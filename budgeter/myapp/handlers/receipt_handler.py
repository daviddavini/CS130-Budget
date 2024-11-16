import requests

class ReceiptHandler:
    def __init__(self, key):
        self.key = key
        self.api_url = "https://api.ocr.space/parse/image"
        pass

    # assuming image represents the whole image file in format accepted by API
    def scan_receipt(self, image):
        payload = {'apikey': self.key, 
               'isOverlayRequired': 'true', 
               'language': 'eng'}

        response = requests.post(self.api_url, files={'file': image}, data=payload)
        return response.json()

    # response is json format
    def parse_ocr_output(self, response):
        
        pass

    def modify_receipt(self, details):
        pass
