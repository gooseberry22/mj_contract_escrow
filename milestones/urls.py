from django.urls import path, include
from rest_framework import routers
from .views import MilestoneViewSet, MilestoneDocumentViewSet

router = routers.DefaultRouter()
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'documents', MilestoneDocumentViewSet, basename='milestone-document')

urlpatterns = [
    path('', include(router.urls)),
]
