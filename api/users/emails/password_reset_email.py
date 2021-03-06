import os
from django.core.mail import send_mail
from smtplib import SMTPException

FRONTEND_URL = os.environ['FRONTEND_URL']
EMAIL_SENDER = os.environ['EMAIL_SENDER']


def send_password_reset_mail(admin_user):
    link = FRONTEND_URL + '/admin/password-update/' + str(admin_user.id)
    subject = 'Password reset'
    html = f'<h1>You have requested a password reset.</h1>\
    <p>Follow the link below to change your password</p>\
    <a href={link}>Password reset</a>'

    try:
        send_mail(subject, html, EMAIL_SENDER, [admin_user.email], html_message=html)
        return None
    except SMTPException as e:
        return e.smtp_error
