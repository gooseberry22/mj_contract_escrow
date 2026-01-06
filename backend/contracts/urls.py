from django.urls import path, include
from rest_framework import routers
from .views import ContractViewSet, ContractDocumentViewSet

router = routers.DefaultRouter()
router.register(r'contracts', ContractViewSet, basename='contract')
router.register(r'documents', ContractDocumentViewSet, basename='contract-document')

urlpatterns = [
    path('', include(router.urls)),
]
