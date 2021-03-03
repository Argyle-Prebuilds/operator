from django.db import models


class HomepageSettings(models.Model):
    html_text = models.TextField(null=True, blank=True)
    logo = models.ImageField(null=True, blank=True, upload_to='images/logos')
    show_button = models.BooleanField(default=False)
    button_text = models.CharField(max_length=30, null=True, blank=True)
