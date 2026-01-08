from rest_framework import serializers
from .models import Milestone, MilestoneDocument
from contracts.serializers import ContractSerializer
from user.serializers import UserListSerializer


class MilestoneDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserListSerializer(read_only=True)
    
    class Meta:
        model = MilestoneDocument
        fields = ('id', 'title', 'file', 'uploaded_at', 'uploaded_by')
        read_only_fields = ('id', 'uploaded_at', 'uploaded_by')


class MilestoneSerializer(serializers.ModelSerializer):
    contract_detail = ContractSerializer(source='contract', read_only=True)
    completed_by_detail = UserListSerializer(source='completed_by', read_only=True)
    created_by_detail = UserListSerializer(source='created_by', read_only=True)
    documents = MilestoneDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Milestone
        fields = (
            'id',
            'contract',
            'contract_detail',
            'title',
            'description',
            'amount',
            'status',
            'due_date',
            'completed_date',
            'completion_notes',
            'completed_by',
            'completed_by_detail',
            'order',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_detail',
            'documents',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by')


class MilestoneCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating milestones"""
    
    class Meta:
        model = Milestone
        fields = (
            'contract',
            'title',
            'description',
            'amount',
            'status',
            'due_date',
            'order',
        )
