import notifications
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from users.models import User

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotification(request):
    notification = Notification.objects.all()
    serializer = NotificationSerializer(notification, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotificationWithUserId(request, id):
    try:
        notification = Notification.objects.filter(user_id=id).order_by('-date')
        serializer = NotificationSerializer(notification, many=True)
        return Response(serializer.data)
    except Notification.DoesNotExist:
        return Response(
            {"message": f"Không thể tìm thông báo với user có id: {id}"},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createNotification(request):
    try:
        user = User.objects.get(id=request.data['user_id'])
        
        message = request.data.get('message', '')

        notification = Notification.objects.create(user=user, message=message)

        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDetailNotification(request, id):
    try:
        notification = Notification.objects.get(id=id)
        serializer = NotificationSerializer(notification, many=False)
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