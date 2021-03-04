from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework.exceptions import ValidationError, APIException

from api.settings import FRONTEND_URL, BASE_URL, EMAIL_SENDER
from users.models import UserInvitationEmailTemplate
from smtplib import SMTPException


def send_user_invitation_mail(user_link):
    link = FRONTEND_URL + '/user/' + str(user_link.uuid)
    user_invitation_settings = UserInvitationEmailTemplate.objects.first()
    if not user_invitation_settings:
        user_link.delete()
        raise ValidationError('The Invitation Email Template is not defined', code='invalid')

    subject = user_invitation_settings.subject

    html = render_to_string('../templates/user_activation.html', {
        'link': link,
        'BASE_URL': BASE_URL,
        'user_activation_settings': user_invitation_settings
    })

    try:
        send_mail(subject, html, EMAIL_SENDER, [user_link.user_email], html_message=html)
        return None
    except SMTPException as e:
        user_link.delete()
        raise APIException(e.smtp_error)
