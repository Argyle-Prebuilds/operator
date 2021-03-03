from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from api.utils.argyle import subscribe_to_webhook, delete_webhook, get_webhooks, ACCOUNT_CONNECTED_EVENT, \
    ACCOUNT_FAILED_EVENT, ACCOUNT_REMOVED_EVENT, ACCOUNT_ADDED_EVENT, PAY_ALLOCATION_ADDED_EVENT, \
    PAY_ALLOCATION_REMOVED_EVENT, PAY_ALLOCATION_UPDATED_EVENT
from link_generator.models import UserLink, LinkedArgyleAccount, LinkedPayAllocation


class SubscribeToWebhookView(APIView):
    def post(self, request):
        response = subscribe_to_webhook('accounts')
        return Response(data=response, status=status.HTTP_200_OK)


class DeleteWebhookView(APIView):
    def delete(self, request, id):
        response = delete_webhook(id)
        return Response(data=response, status=status.HTTP_200_OK)


class ListWebhookView(APIView):
    def get(self, request):
        response = get_webhooks()
        return Response(data=response, status=status.HTTP_200_OK)


class OnWebhookActionView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        event = request.data['event']
        data = request.data['data']
        account_uuid = data['account']
        user_uuid = data['user']

        user_link = UserLink.objects.get(argyle_uuid=user_uuid)

        new_status = None

        if event == ACCOUNT_ADDED_EVENT:
            new_status = LinkedArgyleAccount.ADDED
        elif event == ACCOUNT_REMOVED_EVENT:
            new_status = LinkedArgyleAccount.REMOVED
        elif event == ACCOUNT_CONNECTED_EVENT:
            new_status = LinkedArgyleAccount.CONNECTED
        elif event == ACCOUNT_FAILED_EVENT:
            new_status = LinkedArgyleAccount.FAILED
        else:
            pass

        if new_status:
            linked_account, _ = LinkedArgyleAccount.objects.update_or_create(uuid=account_uuid, user_link=user_link,
                                                                             defaults={'status': new_status})

        pay_allocation_status = None
        if event == PAY_ALLOCATION_ADDED_EVENT:
            pay_allocation_status = LinkedPayAllocation.ADDED
        elif event == PAY_ALLOCATION_UPDATED_EVENT:
            pay_allocation_status = LinkedPayAllocation.UPDATED
        elif event == PAY_ALLOCATION_REMOVED_EVENT:
            pay_allocation_status = LinkedPayAllocation.REMOVED

        if pay_allocation_status:
            pay_allocation_uuid = data['pay_allocation']

            linked_pay_allocation, _ = LinkedPayAllocation.objects.update_or_create(uuid=pay_allocation_uuid, user_link=user_link,
                                                                             defaults={'status': pay_allocation_status})

        return Response(request.data)
