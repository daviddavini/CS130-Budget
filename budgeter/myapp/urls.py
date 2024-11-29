from django.urls import path
from .views import sample_api, receipt_scanning, add_goal, list_goals, remove_goal, google_auth

urlpatterns = [
    path('sample/', sample_api),
    path('scan/', receipt_scanning),
    path('add/', add_goal),
    path('remove/', remove_goal),
    path('list/', list_goals),
    path('google-auth/', google_auth),
]
