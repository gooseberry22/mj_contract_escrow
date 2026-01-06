from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LogOutSerializer,
    SignUpSerializer,
    CustomTokenObtainPairSerializer,
    UserProfileSerializer,
    PasswordChangeSerializer,
    UserListSerializer,
)
from .models import UserAccount


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class SignUpView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = []

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "User registered successfully",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """Get current user's profile information"""
        serializer = UserProfileSerializer(request.user)
        return Response({"status": "success", "user": serializer.data})


class ProfileUpdateView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        """Update current user's profile information"""
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "Profile updated successfully",
                    "user": serializer.data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """Change user's password"""
        serializer = PasswordChangeSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success", "message": "Password changed successfully"}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogOutViewSet(viewsets.GenericViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogOutSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
            response_data = {"status": "success", "message": "Logged out successfully"}
            return Response(response_data, status=status.HTTP_200_OK)
        except TokenError:
            response_data = {
                "status": "error",
                "message": "Token is already blacklisted",
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    """View for listing users with basic information"""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """Get list of users with their basic information"""
        users = UserAccount.objects.filter(is_active=True).order_by("email")
        serializer = UserListSerializer(users, many=True)
        return Response({"status": "success", "users": serializer.data})


class UserDetailView(APIView):
    """View for retrieving and updating user information"""

    permission_classes = (IsAuthenticated,)

    def get(self, request, user_id):
        """Get user details"""
        try:
            user = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Users can only view their own profile unless they're superusers
        if not (request.user.is_superuser or request.user.id == user_id):
            return Response(
                {"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN
            )

        serializer = UserListSerializer(user)
        return Response({"status": "success", "user": serializer.data})

    def put(self, request, user_id):
        """Update user information"""
        try:
            user = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Only admins can update other users, or users can update themselves
        if not (request.user.is_superuser or request.user.id == user_id):
            return Response(
                {"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()

        # Users can only update their own basic fields
        if request.user.id == user_id and not request.user.is_superuser:
            # Regular users can only update their own name
            allowed_fields = ["first_name", "last_name"]
            data = {k: v for k, v in data.items() if k in allowed_fields}

        # Update fields
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]

        # Only superusers can update these fields
        if request.user.is_superuser:
            if "email" in data:
                if (
                    UserAccount.objects.filter(email=data["email"])
                    .exclude(id=user_id)
                    .exists()
                ):
                    return Response(
                        {"error": "Email already exists"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                user.email = data["email"]
            if "is_active" in data:
                user.is_active = data["is_active"]

        # Handle password reset
        if "new_password" in data and data["new_password"]:
            if request.user.id == user_id:
                # Users can change their own password
                user.set_password(data["new_password"])
            elif request.user.is_superuser:
                # Admins can reset any user's password
                user.set_password(data["new_password"])

        user.save()

        serializer = UserListSerializer(user)
        return Response(
            {
                "status": "success",
                "message": "User updated successfully",
                "user": serializer.data,
            }
        )
