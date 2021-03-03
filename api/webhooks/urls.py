from django.urls import path

from webhooks.views import SubscribeToWebhookView, OnWebhookActionView, DeleteWebhookView, ListWebhookView

urlpatterns = [
    path('subscribe/', SubscribeToWebhookView.as_view()),
    path('list/', ListWebhookView.as_view()),
    path('delete/<uuid:id>', DeleteWebhookView.as_view()),
    path('on-webhook-action/', OnWebhookActionView.as_view()),
]

