from django.urls import path
from .views import sample_api, receipt_scanning, set_goal, google_auth, manual_input, get_visualization, manual_auth, login_view

urlpatterns = [
    path('sample/', sample_api),
    path('scan/', receipt_scanning),
    path('set/', set_goal),
    path('google-auth/', google_auth),
    path('manual-input/', manual_input),
    path('visualize/', get_visualization),
    path('signup/', manual_auth),
    path('login/', login_view),
]
