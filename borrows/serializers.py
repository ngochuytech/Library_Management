from rest_framework import serializers

from borrows.models import Borrow

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrow
        fields = '__all__'