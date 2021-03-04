from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from users.models import UserInvitationEmailTemplate
from users.serializers.admin_templates_serializers import UserActivationEmailTemplateCreateSerializer, \
    UserActivationEmailTemplateListSerializer


class UserInvitationEmailTemplateView(ListCreateAPIView):
    """
        Retrieves or edits the user invitation template.
        - - - - - - - - - -
        Expected URL format: ((API_URL))/users/delete/((userID))/
        Expected payload:
        Method: GET
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "id": 1,
            "logo": "http://localhost:8000/media/images/logos/logo.png",
            "body": "<p>Body of the message.</p>",
            "subject": "Subject of the message.",
            "header": "<h1>Header of the message</h1>",
            "button_text": "Click me!",
            "sms_message": "You've been invited to argyle, check your email!"
        }
        - - - - - - - - - -

        - - - - - - - - - -
        Expected payload:
        Method: POST
        Data: {
            "logo": "((File))",
            "body": "((String))",
            "subject": "((String))",
            "header": "((String))",
            "button_text": "((String))",
            "sms_message": "((String))"
        }
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "id": 1,
            "logo": "http://localhost:8000/media/images/logos/logo.png",
            "body": "<p>Body of the message.</p>",
            "subject": "Subject of the message.",
            "header": "<h1>Header of the message</h1>",
            "button_text": "Click me!",
            "sms_message": "You've been invited to argyle, check your email!"
        }
    """
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        return UserInvitationEmailTemplate.objects.first()

    def get_serializer_class(self):
        # We create or update user activation email template based on the request method
        if self.request.method == 'POST':
            return UserActivationEmailTemplateCreateSerializer
        return UserActivationEmailTemplateListSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()
        data = serializer(self.get_queryset(), context={
            'request': self.request}).data
        return Response(data=data, status=status.HTTP_200_OK)
