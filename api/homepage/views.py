from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from api.utils.permissions import CanDisplayHomepageSettings
from homepage.models import HomepageSettings
from homepage.serializers import HomepageSettingsCreateSerializer, \
    HomepageSettingsListSerializer


class HomepageSettingsView(generics.ListCreateAPIView):
    """
        Creates or retrieves the HomepageSettings instance data.
        - - - - - - - - - -
        Expected payload:
        Method: GET
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "id": 1,
            "logo": "http://localhost:8000/media/images/logos/logo.png",
            "html_text": "<p>Welcome!</p>",
            "show_button": true
        }
        - - - - - - - - - -

        - - - - - - - - - -
        Expected payload:
        Method: POST
        Headers: {
            'Authorization': 'Token ((Admin Token))'
        }
        FormData: {
            "html_text": "((Homepage text))",
            "show_button": "((Bool))",
            "logo": "((File))"
        }
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "id": 1,
            "logo": "http://localhost:8000/media/images/logos/logo.png",
            "html_text": "<p>Welcome!</p>",
            "show_button": true
        }
    """
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (CanDisplayHomepageSettings,)

    def get_queryset(self):
        return HomepageSettings.objects.first()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HomepageSettingsCreateSerializer
        return HomepageSettingsListSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()
        data = {
            'logo': None,
            'html_text': '',
            'show_button': False,
            'button_text': ''
        }

        if self.get_queryset():
            data = serializer(self.get_queryset(), context={'request': self.request}).data

        return Response(data=data, status=status.HTTP_200_OK)
