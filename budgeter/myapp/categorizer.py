import google.generativeai as genai
from django.conf import settings


class Categorizer():
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def categorize_item(self, item: str):
        result = self.model.generate_content(
            "What category of spending does this item fall under: '" + item + "'. "
            "Here are some examples of categories and items:\n"
            "- Housing: Rent, Mortgage, Property Taxes\n"
            "- Transportation: Gas, Public Transit, Car Payment\n"
            "- Food: Groceries, Dining Out\n"
            "- Utilities: Electricity, Water, Internet\n"
            "- Medical: Doctor Visits, Medications\n"
            "- Insurance: Health Insurance\n"
            "- Education: Tuition, Books\n"
            "- Entertainment: Movies, Concerts\n"
            "- Clothing: Apparel, Shoes\n"
            "- Personal Care: Haircuts, Makeup, Toiletries\n"
            "- Pet: Pet Food, Vet Visits\n"
            "- Travel: Flights, Hotels\n"
            "- Gifting: Gifts for Others\n"
            "- Miscellaneous: Any other expenses not listed above, like work tools",
            generation_config=genai.GenerationConfig(
                response_mime_type="text/x.enum",
                response_schema={
                    "type": "STRING",
                    "enum": ["Housing", "Transportation", "Food", "Utilities", "Medical", "Insurance", "Education", 
                             "Entertainment", "Clothing", "Personal Care", "Pet", "Travel", "Gifting", "Misc"],
                },
            ),
        )
        print(result.text)
        return result.text
