from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver


from events.models import Event, Attendee

from events.utils import get_ivs_client, prod_only


def delete_ivs_stage(ivs_stage_arn):
    ivs_client = get_ivs_client()

    try:
        ivs_client.delete_stage(
            arn=ivs_stage_arn
        )
    except ivs_client.exceptions.ResourceNotFoundException:
        # It has already been deleted
        pass


@receiver(pre_save, sender=Event)
@prod_only
def handle_ivs_stage(sender, instance, **kwargs):

    if instance.ivs_stage_arn and instance.status not in ['Scheduled', 'InProgress', 'Break']:
        # Make sure IVS stages get cleaned up after the game is done
        delete_ivs_stage(instance.ivs_stage_arn)

    elif instance.host and not instance.ivs_stage_arn:
        # Create a new IVS stage
        ivs_client = get_ivs_client()
        ivs_stage_response = ivs_client.create_stage(
            name=str(instance.id)
        )

        instance.ivs_stage_arn = ivs_stage_response['stage']['arn']


@receiver(pre_delete, sender=Event)
@prod_only
def delete_ivs_stage(sender, instance, **kwargs):

    if instance.ivs_stage_arn:
        # Make sure IVS stages get cleaned up if game is deleted before
        # Status marks it as over, or a manual game with no status is deleted
        delete_ivs_stage(instance.ivs_stage_arn)



@receiver(pre_save, sender=Attendee)
@prod_only
def handle_ivs_participant_token(sender, instance, **kwargs):

    if not instance.event.ivs_stage_arn:
        # No stage to create a participant token for
        return

    ivs_client = get_ivs_client()

    capabilities = ['SUBSCRIBE']
    if instance.event.host_id == instance.user_id:
        capabilities.append('PUBLISH')

    token_response = ivs_client.create_participant_token(
        stageArn=str(instance.event.ivs_stage_arn),
        userId=str(instance.user_id),
        capabilities=capabilities
    )

    instance.ivs_participant_token = token_response['participantToken']['token']