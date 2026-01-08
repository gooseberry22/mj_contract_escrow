from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import UserAccount


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"), username=email, password=password
            )

            if not user:
                raise serializers.ValidationError(
                    "No active account found with the given credentials"
                )
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        refresh = self.get_token(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_superuser": user.is_superuser,
            },
        }

        return data


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserAccount
        fields = ("email", "password", "first_name", "last_name")

    def validate_password(self, value):
        """Validate password using Django's password validators"""
        validate_password(value)
        return value

    def create(self, validated_data):
        user = UserAccount.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        )
        read_only_fields = ("id", "email", "is_staff", "is_superuser", "date_joined")


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        user = self.context["request"].user
        current_password = attrs.get("current_password")
        new_password = attrs.get("new_password")
        confirm_new_password = attrs.get("confirm_new_password")

        if not user.check_password(current_password):
            raise serializers.ValidationError(
                {"current_password": "Current password is incorrect."}
            )

        if new_password != confirm_new_password:
            raise serializers.ValidationError(
                {"confirm_new_password": "New passwords do not match."}
            )

        try:
            validate_password(new_password, user)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"new_password": e.messages})

        return attrs

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class LogOutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(max_length=512)

    def validate(self, attrs):
        validated_attrs = super().validate(attrs)
        self.refresh_token = validated_attrs["refresh_token"]
        return validated_attrs

    def save(self, **kwargs):
        RefreshToken(self.refresh_token).blacklist()


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for listing users with basic information"""

    class Meta:
        model = UserAccount
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "date_joined",
        )
        read_only_fields = ("id", "email", "date_joined")
