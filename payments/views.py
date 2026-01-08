from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Payment, EscrowAccount
from .serializers import (
    PaymentSerializer,
    PaymentCreateSerializer,
    EscrowAccountSerializer,
)


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing payments"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    
    def get_queryset(self):
        """Filter payments based on user role"""
        user = self.request.user
        queryset = Payment.objects.all()
        
        # Users can see payments where they are payer or payee
        if not user.is_superuser:
            queryset = queryset.filter(
                Q(payer=user) | Q(payee=user)
            )
        
        # Filter by contract if provided
        contract_id = self.request.query_params.get('contract')
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        
        return queryset.select_related('contract', 'payer', 'payee', 'created_by')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer
    
    def perform_create(self, serializer):
        """Set the created_by field to the current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update payment status"""
        payment = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Payment.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment.status = new_status
        payment.save()
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)


class EscrowAccountViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing escrow accounts"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = EscrowAccountSerializer
    
    def get_queryset(self):
        """Filter escrow accounts based on user role"""
        user = self.request.user
        queryset = EscrowAccount.objects.all()
        
        # Users can see escrow accounts for their contracts
        if not user.is_superuser:
            queryset = queryset.filter(
                Q(contract__intended_parent=user) | Q(contract__surrogate=user)
            )
        
        # Filter by contract if provided
        contract_id = self.request.query_params.get('contract')
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)
        
        return queryset.select_related('contract')
    
    @action(detail=True, methods=['post'])
    def deposit(self, request, pk=None):
        """Deposit funds into escrow account"""
        escrow_account = self.get_object()
        amount = request.data.get('amount')
        
        if not amount or float(amount) <= 0:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        escrow_account.balance += float(amount)
        escrow_account.total_deposited += float(amount)
        escrow_account.save()
        
        serializer = self.get_serializer(escrow_account)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def release(self, request, pk=None):
        """Release funds from escrow account"""
        escrow_account = self.get_object()
        amount = request.data.get('amount')
        
        if not amount or float(amount) <= 0:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if escrow_account.balance < float(amount):
            return Response(
                {'error': 'Insufficient balance'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        escrow_account.balance -= float(amount)
        escrow_account.total_released += float(amount)
        escrow_account.save()
        
        serializer = self.get_serializer(escrow_account)
        return Response(serializer.data)
