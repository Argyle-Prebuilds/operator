from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from api.utils.argyle import get_pay_dist_config
from link_generator.models import UserLink, LinkedArgyleAccount, LinkedPayAllocation


class PayDistributionSerializer(serializers.Serializer):
    routing_number = serializers.CharField(required=True, max_length=9)
    account_number = serializers.CharField(required=True, max_length=12)
    allocation_type = serializers.CharField(required=True)
    allocation_value = serializers.IntegerField(required=True)
    account_type = serializers.CharField(required=True)

    def validate(self, initial_data):
        errors = {}
        allocation_type = initial_data['allocation_type']
        allocation_value = int(initial_data['allocation_value'])
        if allocation_type != 'percent' and allocation_type != 'amount':
            errors.update({'allocation_type': 'Invalid allocation type'})

        conditions = (
                (allocation_type == 'percent' and (allocation_value < 0 or allocation_value > 100))
                or (allocation_type == 'amount' and allocation_value < 0)
        )
        if conditions:
            errors.update({'allocation_value': 'Invalid allocation value'})

        #   If not all of the keys are present, display 'This field may not be blank' errors
        if errors:
            raise ValidationError(errors)

        return initial_data


class LinkedAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedArgyleAccount
        fields = "__all__"


class LinkedPayAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedPayAllocation
        fields = "__all__"


class UserLinkSerializer(serializers.ModelSerializer):
    pay_distribution_data = PayDistributionSerializer(required=False)
    linked_accounts = LinkedAccountSerializer(many=True, read_only=True)
    linked_pay_allocations = LinkedPayAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = UserLink
        fields = '__all__'

    def create(self, validated_data):
        if 'pay_distribution_data' in validated_data:
            pay_distribution_data = validated_data.pop('pay_distribution_data')
            validated_data.update(pay_distribution_data)
            encrypted_config = get_pay_dist_config(validated_data)
            validated_data['encrypted_config'] = encrypted_config
        instance = UserLink.objects.create(**validated_data)
        return instance


class BaseUserLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLink
        exclude = ('user_email', 'user_phone_number', 'user_full_name')
        read_only_fields = ('uuid',)


class UserArgyleAccountsListSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    link_item = serializers.CharField(max_length=100)
    source = serializers.CharField(max_length=100)
    status = serializers.CharField(max_length=100)


class DataPartnerSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
