import requests
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from api.utils.argyle import get_argyle_api_url, convert_to_base64, get_argyle_credentials

from api.utils.argyle import fetch_argyle_accounts, fetch_data_partners, generate_argyle_token, fetch_argyle_allocations
from link_generator.models import UserLink
from link_generator.serializers import UserLinkSerializer, DataPartnerSerializer, BaseUserLinkSerializer, \
    UserArgyleAccountsListSerializer
from users.emails.user_invitation_email import send_user_invitation_mail
from users.sms.user_invitation_sms import send_user_invitation_sms


class UserLinkLinkCreateAPIView(generics.ListCreateAPIView):
    """
        Creates the UserLink instance, sends an invitation email
        and optionally a text message.
        - - - - - - - - - -
        Expected payload:
        Method: POST
        Headers: {
            'Authorization': 'Token ((Admin Token))'
        }
        Data: {
            "user_full_name": "((String))",
            "user_email": "((String))",

            OPTIONAL FIELDS:
            "user_phone_number": "((String))",
            "data_partner_id": "((String))",
            "pay_distribution_data": {
                "routing_number": "((String))",
                "account_number": "((String))",
                "allocation_type": "((String))",
                "allocation_value": "((Integer))",
                "account_type": "((String))",
            }
        }
        - - - - - - - - - -
        Example of returned data:
        Data: {
            account_number: "123"
            account_type: "checking"
            allocation_type: "percent"
            allocation_value: 1
            argyle_token: null
            argyle_uuid: null
            data_partner_id: null
            encrypted_config: "CiQAB/5leTjB69mOwTWWqBFxk9ZpHpo+nysM4nSmzzuvGrw23l0S0wEAmtjty7EZa+Lq938Wfe1jiwgWL5ks2H58Dk6gCYZHTSa92UH1PijZ23B9tUspCAycOa5JfaN/18zNZoKCrdXsvccCOTcNDTBTxHcvG+oQnWCSwgKOYK0Z9lZOpO1hWXhbOBGanBCzF+7OSAyIBUAQTLSfUT8QtRnPs35WJM0B+B249+Ly3DOVCqXb/9UUC5+4NGVGWe6FKR/ffSiXDilkxZ/Q7TTxb7VqIMjU+frSHWcPap4oMWIFzKgoaLlJHw4MnxvI8Up0FIj/isLlk9RJ2JKJ"
            routing_number: "123"
            user_email: "email@rootxnet.com"
            user_full_name: "John Doe"
            user_phone_number: null
            uuid: "8153902f-9c2e-4f28-96b2-e0b94172f55b"
        }
    """
    serializer_class = UserLinkSerializer
    permission_classes = (IsAdminUser,)
    queryset = UserLink.objects.all()

    def perform_create(self, serializer):
        user_link = serializer.save()
        send_user_invitation_mail(user_link)
        if user_link.user_phone_number:
            send_user_invitation_sms(user_link)


class UserLinkPayDistributions(APIView):
    """
    Gets the UserLink Pay distribution form Argyle API
    - - - - - - - - - -
    Expected URL format: ((API_URL))/user-link/distribution-detail/((userlinkUUID))/
    Expected payload:
    Method: DELETE
    Headers: {
        'Authorization': 'Token ((Admin Token))'
    }
    """

    def get(self, request, uuid):
        flexible_limit = 100
        userlink = UserLink.objects.get(uuid=uuid)
        params = {
            'user': str(userlink.argyle_uuid),
            'limit': flexible_limit,
        }

        #   Make sure we fetch all allocations of the user(increase limit if necessary)
        allocations = fetch_argyle_allocations(params)
        if len(allocations) == flexible_limit:
            while len(allocations) == flexible_limit:
                flexible_limit = flexible_limit * 2
                params['limit'] = flexible_limit
                allocations = fetch_argyle_allocations(params)

        data = {
            'email': userlink.user_email,
            'allocations': allocations
        }

        return Response(status=status.HTTP_200_OK, data=data)


class UserLinkDeleteAPIView(generics.DestroyAPIView):
    """
        Deletes the UserLink instance from the database and all account connections from Argyle
        - - - - - - - - - -
        Expected URL format: ((API_URL))/generator/user-link/delete/((userlinkUUID))/
        Expected payload:
        Method: DELETE
        Headers: {
            'Authorization': 'Token ((Admin Token))'
        }
    """
    serializer_class = UserLinkSerializer
    permission_classes = (IsAdminUser,)
    queryset = UserLink.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        credentials = get_argyle_credentials()
        token = convert_to_base64(credentials)
        headers = {
            'content-type': 'application/json',
            'Authorization': f"Basic {token}"
        }
        params = {
            'user': str(instance.argyle_uuid)
        }
        accounts = fetch_argyle_accounts(params)

        for account in accounts:
            url = get_argyle_api_url() + '/accounts/' + str(account['id'])
            response = requests.delete(url, headers=headers)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResendEmailAPIView(APIView):
    """
    Resending invitation email with UserLink
    - - - - - - - - - -
    Expected URL format: ((API_URL))/generator/user-link/resend-email/((userlinkUUID))/
    Method: GET
    - - - - - - - - - -
    """
    def post(self, request, uuid):
        user_link = UserLink.objects.get(uuid=uuid)
        send_user_invitation_mail(user_link)

        return Response(status=status.HTTP_200_OK)


class ResendSMSAPIView(APIView):
    """
    Resending invitation sms
    - - - - - - - - - -
    Expected URL format: ((API_URL))/generator/user-link/resend-sms/((userlinkUUID))/
    Method: GET
    - - - - - - - - - -
    """
    def post(self, request, uuid):
        user_link = UserLink.objects.get(uuid=uuid)

        if user_link.user_phone_number:
            send_user_invitation_sms(user_link)

        return Response(status=status.HTTP_200_OK)


class UserLinkRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """
        Retrieves or updates a UserLink instance.
        - - - - - - - - - -
        Expected URL format: ((API_URL))/generator/user-link-data/((userlinkUUID))/
        Method: GET
        - - - - - - - - - -
        Example of returned data:
        Data: {
            account_number: "123"
            account_type: "checking"
            allocation_type: "percent"
            allocation_value: 1
            argyle_token: null
            argyle_uuid: null
            data_partner_id: null
            encrypted_config: "CiQAB/5leTjB69mOwTWWqBFxk9ZpHpo+nysM4nSmzzuvGrw23l0S0wEAmtjty7EZa+Lq938Wfe1jiwgWL5ks2H58Dk6gCYZHTSa92UH1PijZ23B9tUspCAycOa5JfaN/18zNZoKCrdXsvccCOTcNDTBTxHcvG+oQnWCSwgKOYK0Z9lZOpO1hWXhbOBGanBCzF+7OSAyIBUAQTLSfUT8QtRnPs35WJM0B+B249+Ly3DOVCqXb/9UUC5+4NGVGWe6FKR/ffSiXDilkxZ/Q7TTxb7VqIMjU+frSHWcPap4oMWIFzKgoaLlJHw4MnxvI8Up0FIj/isLlk9RJ2JKJ"
            routing_number: "123"
            user_email: "email@rootxnet.com"
            user_full_name: "John Doe"
            user_phone_number: null
            uuid: "8153902f-9c2e-4f28-96b2-e0b94172f55b"
        }
        - - - - - - - - - -

        - - - - - - - - - -
        Expected URL format: ((API_URL))/generator/user-link-data/((userlinkUUID))/
        Expected payload:
        Method: POST
        Data: {
            "user_full_name": "((String))",
            "user_email": "((String))",

            OPTIONAL FIELDS:
            "user_phone_number": "((String))",
            "data_partner_id": "((String))",
            "pay_distribution_data": {
                "routing_number": "((String))",
                "account_number": "((String))",
                "allocation_type": "((String))",
                "allocation_value": "((Integer))",
                "account_type": "((String))",
            }
        }
        - - - - - - - - - -
        Example of returned data:
        Data: {
            account_number: "123"
            account_type: "checking"
            allocation_type: "percent"
            allocation_value: 1
            argyle_token: null
            argyle_uuid: null
            data_partner_id: null
            encrypted_config: "CiQAB/5leTjB69mOwTWWqBFxk9ZpHpo+nysM4nSmzzuvGrw23l0S0wEAmtjty7EZa+Lq938Wfe1jiwgWL5ks2H58Dk6gCYZHTSa92UH1PijZ23B9tUspCAycOa5JfaN/18zNZoKCrdXsvccCOTcNDTBTxHcvG+oQnWCSwgKOYK0Z9lZOpO1hWXhbOBGanBCzF+7OSAyIBUAQTLSfUT8QtRnPs35WJM0B+B249+Ly3DOVCqXb/9UUC5+4NGVGWe6FKR/ffSiXDilkxZ/Q7TTxb7VqIMjU+frSHWcPap4oMWIFzKgoaLlJHw4MnxvI8Up0FIj/isLlk9RJ2JKJ"
            routing_number: "123"
            user_email: "email@rootxnet.com"
            user_full_name: "John Doe"
            user_phone_number: null
            uuid: "8153902f-9c2e-4f28-96b2-e0b94172f55b"
        }
    """
    permission_classes = (AllowAny,)
    serializer_class = BaseUserLinkSerializer
    queryset = UserLink.objects.all()
    lookup_field = 'uuid'

    def get(self, request, *args, **kwargs):
        try:
            user = UserLink.objects.get(uuid=kwargs.pop('uuid'))
        except UserLink.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = UserLinkSerializer(user).data

        accounts_data = []
        if user.argyle_uuid:
            params = {
                'user': str(user.argyle_uuid)
            }
            accounts = fetch_argyle_accounts(params)

            accounts_data = UserArgyleAccountsListSerializer(accounts, many=True).data

        return Response(status=status.HTTP_200_OK, data={
            'accounts': accounts_data,
            'details': data
        })


class GenerateArgyleTokenView(APIView):
    """
        Generates an argyle token for the UserLink instance.
        - - - - - - - - - -
        Expected URL format: ((API_URL))/generator/argyle-token//((userUUID))/
        Method: POST
        - - - - - - - - - -
        Example of returned data:
        Data: {
            'token': 'eyK1eXAiOiJKV1QiLCJhSjciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA5NTI5Mjc5LCJqdGkiOiI5Yjk3ZjY0YWFkYTk0ODM0OWY0ZmY4MWY1YjgyNzdiNCIsInVzZXJfaWQiOiJiYzdlY2ZjYy1jZmY4LTQ2YzItYjljNS02Mjc3Y2ZhZjNiZGIiLCJjbGllbnRfaWQiOiJhM2UxMjBmNi0yNGU5LTRlZjctYTMxMy04MDEzNDI3NGExYWIifQ.DAA7mkkTMsk95lHYlr4dRMETRZUWeCmv8aTsDQTnAtQ'
        }
    """
    permission_classes = (AllowAny,)

    def post(self, request, uuid):
        user_link = UserLink.objects.get(uuid=uuid)

        params = {'user': str(user_link.argyle_uuid)}
        token = generate_argyle_token(params)

        if token:
            user_link.argyle_token = token
            user_link.save()

        return Response(status=status.HTTP_200_OK, data={
            'token': token
        })


class DataPartnersListAPIView(APIView):
    """
        Retrieves a list of argyle data partners.
        - - - - - - - - - -
        Expected payload:
        Method: Get
        Headers: {
            'Authorization': 'Token ((Admin Token))'
        }
    """

    def get(self, request):
        search = request.GET.get('search', '')
        params = {'search': search, }

        partners = fetch_data_partners(params)

        return Response(status=status.HTTP_200_OK, data=DataPartnerSerializer(partners, many=True).data)
