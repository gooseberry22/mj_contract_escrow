from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LogOutViewSet,
    SignUpView,
    CustomTokenObtainPairView,
    ProfileView,
    ProfileUpdateView,
    PasswordChangeView,
    UserListView,
    UserDetailView,
)

router = routers.SimpleRouter()
router.register(r"logout", LogOutViewSet, basename="logout")

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/update/", ProfileUpdateView.as_view(), name="profile_update"),
    path("password/change/", PasswordChangeView.as_view(), name="password_change"),
    path("users/", UserListView.as_view(), name="user_list"),
    path("users/<int:user_id>/", UserDetailView.as_view(), name="user_detail"),
    path("", include(router.urls)),
]
