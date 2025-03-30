from rest_framework import serializers

from notifications.models import Notification

class NotificaitonSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    
    class Meta:
        model = Notification
        fields = "__all__"