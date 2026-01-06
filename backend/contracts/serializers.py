from rest_framework import serializers
from .models import Contract, ContractDocument
from user.serializers import UserListSerializer


class ContractDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserListSerializer(read_only=True)
    
    class Meta:
        model = ContractDocument
        fields = ('id', 'title', 'file', 'uploaded_at', 'uploaded_by')
        read_only_fields = ('id', 'uploaded_at', 'uploaded_by')


class ContractSerializer(serializers.ModelSerializer):
    intended_parent_detail = UserListSerializer(source='intended_parent', read_only=True)
    surrogate_detail = UserListSerializer(source='surrogate', read_only=True)
    created_by_detail = UserListSerializer(source='created_by', read_only=True)
    documents = ContractDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Contract
        fields = (
            'id',
            'intended_parent',
            'intended_parent_detail',
            'surrogate',
            'surrogate_detail',
            'title',
            'description',
            'contract_amount',
            'status',
            'start_date',
            'end_date',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_detail',
            'documents',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by')


class ContractCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating contracts"""
    
    class Meta:
        model = Contract
        fields = (
            'intended_parent',
            'surrogate',
            'title',
            'description',
            'contract_amount',
            'status',
            'start_date',
            'end_date',
        )
