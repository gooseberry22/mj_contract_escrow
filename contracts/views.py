from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Contract, ContractDocument
from .serializers import (
    ContractSerializer,
    ContractCreateSerializer,
    ContractDocumentSerializer,
)


class ContractViewSet(viewsets.ModelViewSet):
    """ViewSet for managing contracts"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = ContractSerializer
    
    def get_queryset(self):
        """Filter contracts based on user role"""
        user = self.request.user
        queryset = Contract.objects.all()
        
        # Users can see contracts where they are a party
        if not user.is_superuser:
            queryset = queryset.filter(
                Q(intended_parent=user) | Q(surrogate=user)
            )
        
        return queryset.select_related('intended_parent', 'surrogate', 'created_by')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ContractCreateSerializer
        return ContractSerializer
    
    def perform_create(self, serializer):
        """Set the created_by field to the current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload a document for a contract"""
        contract = self.get_object()
        serializer = ContractDocumentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                contract=contract,
                uploaded_by=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update contract status"""
        contract = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Contract.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contract.status = new_status
        contract.save()
        
        serializer = self.get_serializer(contract)
        return Response(serializer.data)


class ContractDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing contract documents"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = ContractDocumentSerializer
    
    def get_queryset(self):
        contract_id = self.request.query_params.get('contract')
        if contract_id:
            return ContractDocument.objects.filter(contract_id=contract_id)
        return ContractDocument.objects.all()
    
    def perform_create(self, serializer):
        """Set the uploaded_by field to the current user"""
        serializer.save(uploaded_by=self.request.user)
