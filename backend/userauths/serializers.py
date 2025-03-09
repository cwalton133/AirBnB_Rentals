from rest_framework import serializers
from django.contrib.auth import get_user_model
from userauths.models import Profile, ContactUs

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'role', 'bio']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'default': 'guest'}  # Set default role at the serializer level if needed
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            bio=validated_data.get('bio', ''),
            role=validated_data.get('role', 'guest')
        )
        # Hash the password
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(email=attrs['email'], password=attrs['password'])
        if user is None:
            raise serializers.ValidationError("Invalid email or password.")
        return user  # This would likely need to include more context for JWT or session


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'full_name', 'bio', 'phone', 'address', 'country', 'verified', 'image']
        read_only_fields = ['user']  # Prevent modification of the user field through this serializer

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.country = validated_data.get('country', instance.country)
        instance.verified = validated_data.get('verified', instance.verified)

        if 'image' in validated_data:
            instance.image = validated_data['image']

        instance.save()
        return instance


class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = ['full_name', 'email', 'phone', 'subject', 'message']

    def create(self, validated_data):
        # Here you could insert logic for sending emails or notifications based on the contact info.
        return super().create(validated_data)