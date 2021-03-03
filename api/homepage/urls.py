from django.urls import path

from homepage.views import HomepageSettingsView

urlpatterns = [
    path('homepage-settings/', HomepageSettingsView.as_view()),

]
