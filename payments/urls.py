from django.urls import path, include
from rest_framework import routers
from .views import PaymentViewSet, EscrowAccountViewSet

router = routers.DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'escrow', EscrowAccountViewSet, basename='escrow-account')

urlpatterns = [
    path('', include(router.urls)),
]
