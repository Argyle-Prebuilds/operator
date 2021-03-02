from django.urls import path

from users.views.admin_users_views import CreateAdminUser, DeleteAdminUser, \
    GetAdminUsers, ActivateAdminUser

urlpatterns = [
    path('create/', CreateAdminUser.as_view()),
    path('delete/<uuid:pk>/', DeleteAdminUser.as_view()),
    path('list/', GetAdminUsers.as_view()),
    path('activate/<uuid:pk>/', ActivateAdminUser.as_view()),
]

