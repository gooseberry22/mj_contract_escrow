from django.db import models
from django.conf import settings
from contracts.models import Contract


class Milestone(models.Model):
    """Milestone model for tracking contract milestones"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Related entities
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='milestones',
        help_text='The contract this milestone belongs to'
    )
    
    # Milestone details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text='Payment amount for this milestone')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Dates
    due_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    
    # Completion tracking
    completion_notes = models.TextField(blank=True)
    completed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='completed_milestones'
    )
    
    # Metadata
    order = models.PositiveIntegerField(default=0, help_text='Order of milestone in sequence')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_milestones'
    )
    
    class Meta:
        ordering = ['contract', 'order', 'created_at']
        unique_together = ['contract', 'order']
    
    def __str__(self):
        return f"{self.title} - {self.contract.title}"


class MilestoneDocument(models.Model):
    """Documents associated with a milestone"""
    
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='milestones/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.title} - {self.milestone.title}"
