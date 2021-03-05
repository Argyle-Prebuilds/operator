from rest_framework import status, generics, serializers
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView, Response

from api.utils.exceptions import MailException
from users.emails.password_reset_email import send_password_reset_mail
from users.models import AdminUser
from users.serializers.admin_auth_serializers import AdminUserAuthSerializer, TokenSerializer
from users.serializers.admin_users_serializers import AdminUserEmailSerializer, AdminUserPasswordUpdateSerializer


class LoginView(APIView):
    """
        If the provided credentials are valid, returns the user's token.
        - - - - - - - - - -
        Expected payload:
        Method: POST
        Headers: {
            'Authorization': 'Token ((Admin Token))'
        }
        Data: {
            "email": "((String))",
            "password": "((String))",
        }
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "token": "08864d4e0b893e6f1ffde57aa4d4c2959aa1423d"
        }
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        data = request.data

        auth_serializer = AdminUserAuthSerializer(data=data)
        auth_serializer.is_valid(raise_exception=True)

        admin_user = AdminUser.objects.get(email=auth_serializer.data['email'])

        token_serializer = TokenSerializer(data={
            'admin_user': admin_user.id
        })

        token_serializer.is_valid(raise_exception=True)
        token = token_serializer.save()

        return Response(status=status.HTTP_200_OK, data={
            'token': token.key,
            'user_id': admin_user.id
        })


class PasswordResetSendMail(generics.UpdateAPIView):
    """
        If a user with the provided email exists, sends an email containing a link redirecting
        to the password-reset page.
        - - - - - - - - - -
        Expected payload:
        Method: POST
        Data: {
            "email": "((String))",
        }
    """
    permission_classes = (AllowAny,)
    serializer_class = AdminUserEmailSerializer
    queryset = AdminUser.objects.all()
    lookup_field = 'email'

    def get_object(self):
        email = self.request.data['email']
        try:
            return AdminUser.objects.get(email=email)
        except AdminUser.DoesNotExist:
            raise serializers.ValidationError('User does not exist.')

    def perform_update(self, serializer):
        admin_user = serializer.save()
        error = send_password_reset_mail(admin_user)
        if error:
            raise MailException(error)


class PasswordUpdate(generics.UpdateAPIView):
    """
        Makes sure that the user is flagged for password reset and sets
        the new password.
        - - - - - - - - - -
        Expected payload:
        Method: POST
        Data: {
            "user_id": "((UUID))",
            "password": "((String))",
            "password_confirmed": "((String))"
        }
    """
    permission_classes = (AllowAny,)
    serializer_class = AdminUserPasswordUpdateSerializer
    queryset = AdminUser.objects.filter(password_awaiting_reset=True)


class ValidateToken(APIView):
    """
        Checks whether the provided token is valid.
        - - - - - - - - - -
        Expected payload:
        Method: POST
        Data: {
            "token": "((Token))",
        }
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        data = request.data
        if 'token' not in data or not Token.objects.filter(key=data['token']).first():
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_200_OK)
