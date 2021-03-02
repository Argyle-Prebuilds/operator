import os
from smtplib import SMTPException

from django.core.mail import send_mail

FRONTEND_URL = os.environ['FRONTEND_URL']
BASE_URL = os.environ['BASE_URL']
EMAIL_SENDER = os.environ['EMAIL_SENDER']
EMAIL_SENDER_NAME = os.environ['EMAIL_SENDER_NAME']


def send_activation_mail(admin_user):
    link = FRONTEND_URL + '/admin/activate/' + str(admin_user.id)
    subject = f'{EMAIL_SENDER_NAME} - Admin user created for you'
    html = f'<h1>You have been added as an administrator.</h1>\
    <p>Follow the link below to set your password and activate your account.</p>\
    <a href={link}>Activate account</a>'

    try:
        send_mail(subject, html, EMAIL_SENDER, [admin_user.email], html_message=html)
        return None
    except SMTPException as e:
        return e.smtp_error
