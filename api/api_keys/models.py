from django.db import models


class ArgyleAPIKeys(models.Model):
    client_id = models.CharField(max_length=100)
    client_secret = models.CharField(max_length=100)
    plugin_key = models.CharField(max_length=100)
    # Determines whether the keys are from sandbox or production
    is_sandbox_mode = models.BooleanField(default=False)
    webhook_id = models.CharField(max_length=100, blank=True, null=True)

    @staticmethod
    def get_argyle_keys():
        return ArgyleAPIKeys.objects.first()
