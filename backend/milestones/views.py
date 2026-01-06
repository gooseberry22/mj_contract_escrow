from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Milestone, MilestoneDocument
from .serializers import (
    MilestoneSerializer,
    MilestoneCreateSerializer,
    MilestoneDocumentSerializer,
)


class MilestoneViewSet(viewsets.ModelViewSet):
    """ViewSet for managing milestones"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = MilestoneSerializer
    
    def get_queryset(self):
        """Filter milestones based on user role"""
        user = self.request.user
        queryset = Milestone.objects.all()
        
        # Users can see milestones for their contracts
        if not user.is_superuser:
            queryset = queryset.filter(
                Q(contract__intended_parent=user) | Q(contract__surrogate=user)
            )
        
        # Filter by contract if provided
        contract_id = self.request.query_params.get('contract')
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        
        return queryset.select_related('contract', 'completed_by', 'created_by')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MilestoneCreateSerializer
        return MilestoneSerializer
    
    def perform_create(self, serializer):
        """Set the created_by field to the current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload a document for a milestone"""
        milestone = self.get_object()
        serializer = MilestoneDocumentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                milestone=milestone,
                uploaded_by=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        """Mark milestone as completed"""
        milestone = self.get_object()
        completion_notes = request.data.get('completion_notes', '')
        
        milestone.status = 'completed'
        milestone.completion_notes = completion_notes
        milestone.completed_by = request.user
        from django.utils import timezone
        milestone.completed_date = timezone.now().date()
        milestone.save()
        
        serializer = self.get_serializer(milestone)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update milestone status"""
        milestone = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Milestone.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        milestone.status = new_status
        if new_status == 'completed' and not milestone.completed_date:
            from django.utils import timezone
            milestone.completed_date = timezone.now().date()
            milestone.completed_by = request.user
        milestone.save()
        
        serializer = self.get_serializer(milestone)
        return Response(serializer.data)


class MilestoneDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing milestone documents"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = MilestoneDocumentSerializer
    
    def get_queryset(self):
        milestone_id = self.request.query_params.get('milestone')
        if milestone_id:
            return MilestoneDocument.objects.filter(milestone_id=milestone_id)
        return MilestoneDocument.objects.all()
    
    def perform_create(self, serializer):
        """Set the uploaded_by field to the current user"""
        serializer.save(uploaded_by=self.request.user)
