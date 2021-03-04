from django.urls import path

from link_generator.views import DataPartnersListAPIView, UserLinkRetrieveUpdateAPIView, GenerateArgyleTokenView, UserLinkLinkCreateAPIView, ResendEmailAPIView, ResendSMSAPIView, UserLinkDeleteAPIView, UserLinkPayDistributions


urlpatterns = [
    path('user-link/', UserLinkLinkCreateAPIView.as_view()),
    path('user-link/delete/<uuid:pk>/', UserLinkDeleteAPIView.as_view()),
    path('user-link/distribution-detail/<uuid:uuid>/', UserLinkPayDistributions.as_view()),
    path('user-link/resend-email/<uuid:uuid>/', ResendEmailAPIView.as_view()),
    path('user-link/resend-sms/<uuid:uuid>/', ResendSMSAPIView.as_view()),
    path('user-link-data/<uuid:uuid>/', UserLinkRetrieveUpdateAPIView.as_view()),
    path('argyle-token/<uuid:uuid>/', GenerateArgyleTokenView.as_view()),
    path('data-partners/', DataPartnersListAPIView.as_view()),
]
