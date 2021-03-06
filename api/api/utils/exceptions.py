from rest_framework.exceptions import APIException


class MailException(APIException):
    status_code = 400
    detail = "SMTP error"

    def __init__(self, message=''):
        self.detail = message if message else self.detail


class ArgyleIntegration(APIException):
    status_code = 400
    detail = "Argyle credentials"

    def __init__(self, message=''):
        self.detail = message if message else self.detail


class TwilioIntegration(APIException):
    status_code = 400
    detail = "Twilio exception"

    def __init__(self, message=''):
        self.detail = message if message else self.detail
