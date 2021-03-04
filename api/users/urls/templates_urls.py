from django.urls import path

from users.views.admin_templates_views import UserInvitationEmailTemplateView

urlpatterns = [

    path('activation-user-template/', UserInvitationEmailTemplateView.as_view()),

]
