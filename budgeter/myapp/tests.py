from django.test import TestCase
import os
import json
from .ocr_service import parse_receipt_image
from dotenv import load_dotenv
from .models import Goal

# Create your tests here.

class OCRServiceTest(TestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        load_dotenv()
        cls.image_path = 'myapp/utils/sample_receipts/standard-grocery-receipt-template.png'  # Sample Receipt
        if not os.path.isfile(cls.image_path):
            print(f"Image file does not exist: {cls.image_path}")
        cls.api_key = os.getenv('OCR_API_KEY')

    def test_parse_receipt_image(self):
        """Test the OCR function returns expected results."""
        result = parse_receipt_image(self.image_path)
        self.assertIsInstance(result, dict)  # Check if the result is a dictionary
        self.assertIn('ParsedResults', result)  # Check if 'ParsedResults' key exists in response
        # Write the JSON result to a file
        # with open('myapp/utils/test_outputs/ocr_results.json', 'w') as json_file:
           # json.dump(result, json_file, indent=4)  # Pretty print with indentation
"""
class GoalModelTest(TestCase):
    def setUp(self):
        Goal.objects.create(user="John Doe", amount=1000.00, start_date="2024-01-01", end_date="2024-12-31", spending_type="Housing")

    def test_goal_creation(self):
        goal = Goal.objects.get(user="John Doe")
        self.assertEqual(goal.amount, 1000.00)
        self.assertEqual(goal.spending_type, "Housing")
"""
