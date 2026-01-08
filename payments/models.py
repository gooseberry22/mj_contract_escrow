from django.db import models
from django.conf import settings
from contracts.models import Contract


class Payment(models.Model):
    """Payment model for escrow payments"""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
    ]

    PAYMENT_TYPE_CHOICES = [
        ("deposit", "Deposit"),
        ("milestone", "Milestone Payment"),
        ("final", "Final Payment"),
        ("refund", "Refund"),
    ]

    # Related entities
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="payments",
        help_text="The contract this payment is associated with",
    )
    payer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments_made",
        help_text="The user making the payment",
    )
    payee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments_received",
        help_text="The user receiving the payment",
    )

    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # Payment processing
    transaction_id = models.CharField(
        max_length=255, blank=True, null=True, unique=True
    )
    payment_method = models.CharField(max_length=50, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)

    # Metadata
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_payments",
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment {self.id} - ${self.amount} - {self.get_status_display()}"


class EscrowAccount(models.Model):
    """Escrow account to hold funds for a contract"""

    contract = models.OneToOneField(
        Contract, on_delete=models.CASCADE, related_name="escrow_account"
    )
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_deposited = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_released = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Escrow Account for {self.contract.title} - Balance: ${self.balance}"
