from rest_framework.exceptions import ValidationError
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client
from api import settings
from api.utils.exceptions import TwilioIntegration
from api.settings import FRONTEND_URL
from users.models import UserInvitationEmailTemplate

SMS_INVITATION_LINK_CODE = "[Invitation Link]"


def send_user_invitation_sms(user_link):
    account_sid = settings.TWILIO_ACCOUNT_SID
    auth_token = settings.TWILIO_AUTH_TOKEN
    from_number = settings.TWILIO_INCOMING_PHONE_NUMBER

    client = Client(account_sid, auth_token)
    user_invitation_settings = UserInvitationEmailTemplate.objects.first()
    if not user_invitation_settings or not user_invitation_settings.sms_message:
        raise ValidationError('The Invitation Sms Message is not defined', code='invalid')

    sms_message = user_invitation_settings.sms_message

    # Insert user's unique invitation link
    invitation_link = FRONTEND_URL + '/user/' + str(user_link.uuid)
    sms_message = sms_message.replace(SMS_INVITATION_LINK_CODE, invitation_link)

    try:
        sms = client.messages.create(body=sms_message, from_=from_number, to=user_link.user_phone_number)
    except TwilioRestException as e:
        raise TwilioIntegration(str(e))
