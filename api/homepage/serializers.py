import os
from rest_framework import serializers
from homepage.models import HomepageSettings
BASE_URL = os.environ['BASE_URL']


class HomepageSettingsCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = HomepageSettings
        fields = '__all__'

    def create(self, validated_data):
        homepage = HomepageSettings.objects.first()

        if homepage:
            for key, value in validated_data.items():
                setattr(homepage, key, value)
            homepage.save()
            return homepage

        return HomepageSettings.objects.create(**validated_data)


class HomepageSettingsListSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = HomepageSettings
        fields = '__all__'

    def get_logo(self, obj):
        if obj.logo and hasattr(obj.logo, 'url'):
            photo_url = BASE_URL + obj.logo.url
            return photo_url
        return None
