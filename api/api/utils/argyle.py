import os
import base64
import requests

from api.utils.exceptions import ArgyleIntegration
from api_keys.models import ArgyleAPIKeys

BASE_URL = os.environ['BASE_URL']
ARGYLE_API_URL = os.environ['ARGYLE_API_URL']
ARGYLE_LINK_URL = os.environ['ARGYLE_LINK_URL']
SANDBOX_ARGYLE_API_URL = os.environ['SANDBOX_ARGYLE_API_URL']
SANDBOX_ARGYLE_LINK_URL = os.environ['SANDBOX_ARGYLE_LINK_URL']

ACCOUNT_CONNECTED_EVENT = 'accounts.connected'
ACCOUNT_FAILED_EVENT = 'accounts.failed'
ACCOUNT_REMOVED_EVENT = 'accounts.removed'
ACCOUNT_ADDED_EVENT = 'accounts.added'

PAY_ALLOCATION_ADDED_EVENT = "pay_allocations.added"
PAY_ALLOCATION_REMOVED_EVENT = "pay_allocations.removed"
PAY_ALLOCATION_UPDATED_EVENT = "pay_allocations.updated"

WEBHOOKS = {
    'accounts': [ACCOUNT_CONNECTED_EVENT, ACCOUNT_FAILED_EVENT, ACCOUNT_REMOVED_EVENT, ACCOUNT_ADDED_EVENT,
                 PAY_ALLOCATION_ADDED_EVENT, PAY_ALLOCATION_UPDATED_EVENT, PAY_ALLOCATION_REMOVED_EVENT]
}


# getting the proper Argyle API url - sandbox or production, based on the settings
def get_argyle_api_url():
    argyle_settings = ArgyleAPIKeys.get_argyle_keys()

    return SANDBOX_ARGYLE_API_URL if argyle_settings.is_sandbox_mode else ARGYLE_API_URL


# getting the proper Argyle Link url - sandbox or production, based on the settings
def get_argyle_api_link_url():
    argyle_settings = ArgyleAPIKeys.get_argyle_keys()

    return SANDBOX_ARGYLE_LINK_URL if argyle_settings.is_sandbox_mode else ARGYLE_LINK_URL


def convert_to_base64(text):
    text_base64 = text.encode('ascii')
    text_bytes = base64.b64encode(text_base64)
    return text_bytes.decode('ascii')


# preparing credentials for Argyle API authorization
def get_argyle_credentials():
    keys = ArgyleAPIKeys.get_argyle_keys()

    if not keys:
        raise ArgyleIntegration('No Argyle credentials')

    if not keys.client_id or not keys.client_secret:
        return None

    credentials = f"{keys.client_id}:{keys.client_secret}"
    return credentials


# Fetching accounts from Argyle API endpoint - https://argyle.com/docs/api-reference/accounts
def fetch_argyle_accounts(params):
    credentials = get_argyle_credentials()

    url = get_argyle_api_url() + '/accounts'
    token = convert_to_base64(credentials)
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 401:
        raise ArgyleIntegration("Can't fetch Argyle accounts because of invalid argyle credentials")

    data = response.json()
    if 'results' in data:
        return data['results']

    return []


# Fetching info about pay allocations from Argyle API endpoint - https://argyle.com/docs/api-reference/pay-allocations
def fetch_argyle_allocations(params):
    credentials = get_argyle_credentials()

    url = get_argyle_api_url() + '/pay-allocations'
    token = convert_to_base64(credentials)
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 401:
        raise ArgyleIntegration("Can't fetch Argyle allocations because of invalid argyle credentials")

    data = response.json()
    if 'results' in data:
        return data['results']

    return []


# generating Token for Argyle API authorization
def generate_argyle_token(params):
    credentials = get_argyle_credentials()
    url = get_argyle_api_url() + '/user-tokens'
    token = convert_to_base64(credentials)
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}
    response = requests.post(url, headers=headers, json=params)
    if response.status_code == 401:
        raise ArgyleIntegration("Can't generate token, because of invalid argyle credentials")

    data = response.json()

    if 'access' in data:
        return data['access']
    return ""


# Encrypting pay distribution config data - https://argyle.com/docs/pay-distributions-guide/link-integration
def get_pay_dist_config(data):
    credentials = get_argyle_credentials()
    if not credentials:
        raise ArgyleIntegration('No argyle credentials')
    token = convert_to_base64(credentials)
    url = get_argyle_api_url() + '/pay-distribution-config/encrypt'
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}
    payload = {
        "bank_account": {
            "bank_name": "Bank",
            "routing_number": data['routing_number'],
            "account_number": data['account_number'],
            "account_type": data['account_type']
        },
        "default_allocation_type": data['allocation_type'],
    }

    if data['allocation_type'] == 'percent':
        payload['percent_allocation'] = {
            "value": data['allocation_value'],
            "min_value": data['allocation_value'],
            "max_value": data['allocation_value']
        }

    if data['allocation_type'] == 'amount':
        payload['amount_allocation'] = {
            "value": data['allocation_value'],
            "min_value": data['allocation_value'],
            "max_value": data['allocation_value']
        }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 401:
        raise ArgyleIntegration("Can't create direct deposit config because of invalid Argyle credentials")

    data = response.json()
    return data['encrypted_config']


# Fetching list of data partners from Argyle API - https://argyle.com/docs/api-reference/link-items
def fetch_data_partners(params):
    credentials = get_argyle_credentials()

    url = get_argyle_api_link_url() + '/link-items'

    token = convert_to_base64(credentials)
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 401:
        raise ArgyleIntegration("Can't fetch data partners, because of invalid Argyle API keys")

    data = response.json()
    if 'results' in data:
        return data['results']

    return []


# Argyle API webhooks are used to always have the most current data from Argyle API
def subscribe_to_webhook(webhooks_group):
    credentials = get_argyle_credentials()
    url = get_argyle_api_url() + '/webhooks'
    token = convert_to_base64(credentials)
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}

    webhooks_events = WEBHOOKS[webhooks_group]

    params = {"events": webhooks_events,
              "name": "Webhook action",
              "url": BASE_URL + '/webhooks/on-webhook-action/'}

    response = requests.post(url, headers=headers, json=params)

    if response.status_code == 401:
        raise ArgyleIntegration("Can't fetch Argyle accounts because of invalid argyle credentials")

    data = response.json()
    return data


def delete_webhook(webhook_id):
    credentials = get_argyle_credentials()
    url = get_argyle_api_url() + '/webhooks/' + str(webhook_id)
    token = convert_to_base64(credentials)
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}

    response = requests.delete(url, headers=headers)

    if response.status_code == 401:
        raise ArgyleIntegration("Can't fetch Argyle accounts because of invalid argyle credentials")

    data = response.content
    return data


def get_webhooks():
    credentials = get_argyle_credentials()
    url = get_argyle_api_url() + '/webhooks'
    token = convert_to_base64(credentials)
    headers = {'content-type': 'application/json', 'Authorization': f"Basic {token}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 401:
        raise ArgyleIntegration("Can't fetch Argyle accounts because of invalid argyle credentials")

    data = response.json()
    return data
