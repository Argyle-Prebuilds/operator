from rest_framework.permissions import BasePermission, IsAdminUser


class CanDisplayHomepageSettings(BasePermission):
    """
    Allows access to admin users except for method GET which is available to all users.
    """

    def has_permission(self, request, view):
        if request.method == 'GET':
            return True

        return (IsAdminUser()).has_permission(request, view)

