from django.db import models
from uuid import uuid4

ALLOCATION_TYPES_CHOICES = (
    ('percent', 'Percent'),
    ('amount', 'Amount')
)

ALLOCATION_ACCOUNT_TYPES_CHOICES = (
    ('checking', 'Checking'),
    ('savings', 'Savings')
)


class UserLink(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user_full_name = models.CharField(max_length=100)
    user_email = models.EmailField(unique=True)
    user_phone_number = models.CharField(null=True, blank=True, max_length=12)
    data_partner_id = models.CharField(max_length=50, null=True, blank=True)
    routing_number = models.CharField(max_length=9, null=True, blank=True)
    account_number = models.CharField(max_length=12, null=True, blank=True)
    allocation_type = models.CharField(max_length=7, choices=ALLOCATION_TYPES_CHOICES, null=True, blank=True)
    allocation_value = models.IntegerField(null=True, blank=True)
    account_type = models.CharField(max_length=8, choices=ALLOCATION_ACCOUNT_TYPES_CHOICES, null=True, blank=True)
    argyle_uuid = models.UUIDField(null=True, blank=True, unique=True)
    argyle_token = models.CharField(max_length=400, null=True, blank=True)
    argyle_account_id = models.UUIDField(null=True, blank=True)
    encrypted_config = models.CharField(max_length=800, blank=True)


class LinkedArgyleAccount(models.Model):
    ADDED = 1
    CONNECTED = 2
    FAILED = 3
    REMOVED = 4

    STATUSES = ((ADDED, 'Added'), (CONNECTED, 'Connected'), (FAILED, 'Failed'), (REMOVED, 'Removed'))

    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    status = models.IntegerField(choices=STATUSES, default=ADDED)
    user_link = models.ForeignKey(UserLink, on_delete=models.CASCADE, related_name="linked_accounts")


class LinkedPayAllocation(models.Model):
    ADDED = 1
    UPDATED = 2
    REMOVED = 3

    STATUSES = ((ADDED, 'Added'), (UPDATED, 'Updated'), (REMOVED, 'Removed'))

    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)  # pay allocation uuid
    account_uuid = models.UUIDField(default=uuid4, editable=False)  # account  uuid
    user_link = models.ForeignKey(UserLink, on_delete=models.CASCADE, related_name="linked_pay_allocations")
    status = models.IntegerField(choices=STATUSES, default=ADDED)
