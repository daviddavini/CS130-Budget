from django.test import TestCase
import os
import json
from dotenv import load_dotenv
from .ocr_service import OCRHandler
from .categorizer import Categorizer
from .models import Goal


class OCRServiceTest(TestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        load_dotenv()
        cls.image_path = 'myapp/utils/sample_receipts/standard-grocery-receipt-template.png'  # Sample Receipt
        if not os.path.isfile(cls.image_path):
            print(f"Image file does not exist: {cls.image_path}")
        cls.OCR = OCRHandler()

    def test_parse_receipt_image(self):
        """Test the OCR function returns expected results."""
        result = self.OCR.parse_receipt_image(self.image_path)
        self.assertIsInstance(result, dict)  # Check if the result is a dictionary
        self.assertIn('ParsedResults', result)  # Check if 'ParsedResults' key exists in response
        # Write the JSON result to a file
        #with open('myapp/utils/test_outputs/ocr_results.json', 'w') as json_file:
            #json.dump(result, json_file, indent=4)  # Pretty print with indentation


class CategorizerTest(TestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Instantiate the Categorizer class
        cls.categorizer = Categorizer()
    
    def test_categorize_item(self):
        """Test the categorize_item function returns a valid category."""
        
        expected_result = "Food"
        category = self.categorizer.categorize_item("eggs")
        self.assertEqual(category, expected_result)  # Check if the returned category is as expected
        

"""
class GoalModelTest(TestCase):
    def setUp(self):
        Goal.objects.create(user="John Doe", amount=1000.00, start_date="2024-01-01", end_date="2024-12-31", spending_type="Housing")

    def test_goal_creation(self):
        goal = Goal.objects.get(user="John Doe")
        self.assertEqual(goal.amount, 1000.00)
        self.assertEqual(goal.spending_type, "Housing")
"""
