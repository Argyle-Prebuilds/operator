from django.urls import path

from users.views.admin_auth_views import LoginView, PasswordResetSendMail, PasswordUpdate, ValidateToken

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('password-reset', PasswordResetSendMail.as_view()),
    path('password-update/<uuid:pk>', PasswordUpdate.as_view()),
    path('validate-token/', ValidateToken.as_view()),
]
