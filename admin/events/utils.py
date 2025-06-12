import boto3
from django.conf import settings


def get_ivs_client():
    return boto3.client('ivs-realtime', region_name='us-east-1')


def prod_only(func):

    def inner_prod_only(*args, **kwargs):

        if settings.STAGE != 'prod':
            return

        return func(*args, **kwargs)

    return inner_prod_only