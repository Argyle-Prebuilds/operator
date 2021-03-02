from rest_framework import serializers
from rest_framework.authtoken.models import Token

from users.models import AdminUser


class AdminUserAuthSerializer(serializers.Serializer):
    """
        AdminUser authentication validator
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def validate_email(self, value):
        """
            Validate whether the user exists and if he is a superuser
        """
        if not AdminUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('User does not exist.')
        return value

    def validate_password(self, value):
        """
            Validate whether the password matches
        """
        try:
            admin_user = AdminUser.objects.get(email=self.initial_data['email'])
            if not admin_user.check_password(value):
                raise serializers.ValidationError('Invalid password.')
        except AdminUser.DoesNotExist:
            pass

        return value

    def get_user(self):
        return AdminUser.objects.get(email=self.validated_data['email'])


class TokenSerializer(serializers.Serializer):
    """
        Creates a Token and removes the previous one if existed
    """
    admin_user = serializers.UUIDField(required=True)

    def validate_admin_user(self, value):
        try:
            AdminUser.objects.get(id=value)
        except AdminUser.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

    def save(self):
        admin_user = AdminUser.objects.get(id=self.validated_data['admin_user'])
        existing_token = Token.objects.filter(user=admin_user)

        if existing_token:
            existing_token.delete()

        new_token = Token.objects.create(user=admin_user)
        return new_token
