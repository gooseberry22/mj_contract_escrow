from rest_framework import serializers
from .models import Payment, EscrowAccount
from contracts.serializers import ContractSerializer
from user.serializers import UserListSerializer


class PaymentSerializer(serializers.ModelSerializer):
    contract_detail = ContractSerializer(source='contract', read_only=True)
    payer_detail = UserListSerializer(source='payer', read_only=True)
    payee_detail = UserListSerializer(source='payee', read_only=True)
    created_by_detail = UserListSerializer(source='created_by', read_only=True)
    
    class Meta:
        model = Payment
        fields = (
            'id',
            'contract',
            'contract_detail',
            'payer',
            'payer_detail',
            'payee',
            'payee_detail',
            'amount',
            'payment_type',
            'status',
            'transaction_id',
            'payment_method',
            'payment_date',
            'description',
            'notes',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_detail',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by', 'transaction_id')


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments"""
    
    class Meta:
        model = Payment
        fields = (
            'contract',
            'payer',
            'payee',
            'amount',
            'payment_type',
            'description',
            'notes',
        )


class EscrowAccountSerializer(serializers.ModelSerializer):
    contract_detail = ContractSerializer(source='contract', read_only=True)
    
    class Meta:
        model = EscrowAccount
        fields = (
            'id',
            'contract',
            'contract_detail',
            'balance',
            'total_deposited',
            'total_released',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'balance', 'total_deposited', 'total_released', 'created_at', 'updated_at')
