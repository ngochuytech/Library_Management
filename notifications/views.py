from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from notifications.models import Notification
from notifications.serializers import NotificaitonSerializer

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getNotification(request):
    notification = Notification.objects.all()
    serializer = NotificaitonSerializer(notification, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createNotification(request):
    serializer = NotificaitonSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDetailNotification(request, id):
    try:
        notification = Notification.objects.get(id=id)
        serializer = NotificaitonSerializer(notification, many=False)
        return Response(serializer.data)
    except Notification.DoesNotExist:
        return Response(
            {"message": f"Cannot find notification with id: {id}"},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteNotificationWithId (request, id):
    try:
        notification = Notification.objects.get(id=id)
        notification.delete()
        return Response("Delete notification successfully!")
    except Notification.DoesNotExist:
        return Response({"message": f"Cannot find notification with id = {id}"}, status=status.HTTP_400_BAD_REQUEST)