from django.urls import path

from api_keys.views import APIKeyListCreateView, ArgylePluginKeyView

urlpatterns = [
    path('api-keys/', APIKeyListCreateView.as_view()),
    path('argyle-plugin/', ArgylePluginKeyView.as_view()),
]
