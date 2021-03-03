from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from api.utils.argyle import get_argyle_api_url

from api_keys.models import ArgyleAPIKeys
from api_keys.serializers import ArgyleAPIKeysSerializer, ArgylePluginKeySerializer


class APIKeyListCreateView(generics.ListCreateAPIView):
    """
        Creates or retrieves the ArgyleAPIKeys instance data.
        - - - - - - - - - -
        Expected payload:
        Method: GET
        Headers: {
            'Authorization': 'Token ((Admin Token))'
        }
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "id": 1,
            "client_id": "((client_id))",
            "client_secret": "((client_secret))",
            "plugin_key": "((plugin_key))"
        }
        - - - - - - - - - -

        - - - - - - - - - -
        Expected payload:
        Method: POST
        Headers: {
            'Authorization': 'Token ((Admin Token))'
        }
        Data: {
            "client_id": "((client_id))",
            "client_secret": "((client_secret))",
            "plugin_key": "((plugin_key))"
            "is_sandbox_mode": "((Bool))"
        }
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "id": 1,
            "client_id": "((client_id))",
            "client_secret": "((client_secret))",
            "plugin_key": "((plugin_key))"
            "is_sandbox_mode": "((Bool))"
        }
    """
    serializer_class = ArgyleAPIKeysSerializer
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        return ArgyleAPIKeys.get_argyle_keys()

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()

        data = {
            'client_id': '',
            'client_secret': '',
            'plugin_key': ''
        }

        if self.get_queryset():
            data = serializer(self.get_queryset(), context={'request': self.request}).data

        return Response(data=data, status=status.HTTP_200_OK)


class ArgylePluginKeyView(APIView):
    """
        Retrieves the value of 'plugin_key' of the ArgyleAPIKey instance.
        - - - - - - - - - -
        Expected payload:
        Method: GET
        - - - - - - - - - -
        Example of returned data:
        Data: {
            "plugin": "((plugin_key))"
            "host": "((argyle_host_url))"
        }
    """
    serializer_class = ArgylePluginKeySerializer
    permission_classes = ()

    def get(self, request):
        argyle_keys = ArgyleAPIKeys.get_argyle_keys()

        if not argyle_keys:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "No Argyle keys"})

        api_host = get_argyle_api_url()
        plugin_key = argyle_keys.plugin_key
        if not plugin_key:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "No plugin key"})

        return Response(status=status.HTTP_200_OK, data={
            'plugin': plugin_key,
            'host': api_host
            })
