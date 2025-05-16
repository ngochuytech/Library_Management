from rest_framework import serializers
from users.models import User
from users.exceptions import InvalidPhoneNumberException
import re

class UserSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone_number', 'avatar', 'is_superuser','is_active', 'created_at']
        read_only_fields = ['email', 'created_at','is_superuser']

    def validate_phone_number(self, value):
        if value and not re.match(r'^\d{9,15}$', value):
            raise InvalidPhoneNumberException("Số điện thoại chỉ được chứa số, tối đa 15 chữ số!")
        return value

    def get_created_at(self, obj):
        if obj.created_at:
            return obj.created_at.strftime('%d/%m/%Y')
        return None