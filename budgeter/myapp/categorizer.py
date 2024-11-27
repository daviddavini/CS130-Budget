import google.generativeai as genai
from django.conf import settings


class Categorizer():
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def categorize_item(self, item: str):
        result = self.model.generate_content(
            "What category of spending does this item fall under: " + item,
            generation_config=genai.GenerationConfig(
                response_mime_type="text/x.enum",
                response_schema={
                    "type": "STRING",
                    "enum": ["Housing", "Transportation", "Food", "Utilities", "Medical", "Insurance", "Education", 
                             "Entertainment", "Clothing", "PersonalCare", "Pet", "Travel", "Gifting", "Misc"],
                },
            ),
        )
        print(result.text)
        return result.text