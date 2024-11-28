from django.urls import path
from .views import sample_api, receipt_scanning, google_auth

urlpatterns = [
    path('sample/', sample_api),
    path('scan/', receipt_scanning),
    path('google-auth/', google_auth),
]
