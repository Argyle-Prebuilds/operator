from rest_framework import serializers

from api.utils.argyle import subscribe_to_webhook, delete_webhook
from api_keys.models import ArgyleAPIKeys


class ArgyleAPIKeysSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArgyleAPIKeys
        fields = '__all__'

    def connect_webhooks(self, api_keys):

        if api_keys.webhook_id:
            delete_webhook(api_keys.webhook_id)
        data = subscribe_to_webhook('accounts')
        api_keys.webhook_id = data['id']
        api_keys.save()

        return api_keys

    def create(self, validated_data):
        api_keys = ArgyleAPIKeys.objects.first()

        if api_keys:
            for key, value in validated_data.items():
                setattr(api_keys, key, value)
            api_keys.save()
            self.connect_webhooks(api_keys)
            return api_keys

        api_keys = ArgyleAPIKeys.objects.create(**validated_data)
        self.connect_webhooks(api_keys)
        return api_keys


class ArgylePluginKeySerializer(serializers.ModelSerializer):

    class Meta:
        model = ArgyleAPIKeys
        fields = ('plugin_key', )