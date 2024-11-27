from django.urls import path
from .views import sample_api, receipt_scanning

urlpatterns = [
    path('sample/', sample_api),
    path('scan/', receipt_scanning),
]
