import os
from rest_framework import serializers
from users.models import UserInvitationEmailTemplate

BASE_URL = os.environ['BASE_URL']


class UserActivationEmailTemplateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInvitationEmailTemplate
        fields = '__all__'

    def create(self, validated_data):
        template = UserInvitationEmailTemplate.objects.first()

        if template:
            for key, value in validated_data.items():
                setattr(template, key, value)
            template.save()
            return template

        return UserInvitationEmailTemplate.objects.create(**validated_data)


class UserActivationEmailTemplateListSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = UserInvitationEmailTemplate
        fields = '__all__'

    def get_logo(self, obj):
        if obj.logo and hasattr(obj.logo, 'url'):
            photo_url = BASE_URL + obj.logo.url
            return photo_url
        return None
