from enum import unique
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db.models.signals import post_save


# Define role choices as a class variable in the User model.
ROLE_CHOICES = (
    ('admin', 'Admin'),
    ('agent', 'Agent'),
    ('buyer', 'Buyer'),
    ('host', 'Host'),
    ('guest', 'Guest'),
)

class User(AbstractUser):
    email = models.EmailField(unique=True)  # Unique email field
    username = models.CharField(max_length=100, unique=True)  # Ensure username is unique
    bio = models.CharField(max_length=100, blank=True)  # Optional biography
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='guest')  # Default role

    # Override the USERNAME_FIELD to use email for authentication
    USERNAME_FIELD = "email"

    # Specify required fields when creating a user
    REQUIRED_FIELDS = ['username', 'role']

    # Customizing the groups and permissions fields to avoid reverse accessor clashes
    groups = models.ManyToManyField(
        Group,
        related_name="userauths_users",  # Unique related name to prevent clashes
        blank=True,
        help_text="The groups this user belongs to.",
        related_query_name="userauths_user"
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name="userauths_users_permissions",  # Unique related name to prevent clashes
        blank=True,
        help_text="Specific permissions for this user.",
        related_query_name="userauths_user_permission"
    )

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="image", null=True, blank=True)
    full_name = models.CharField(max_length=200, null=True, blank=True)
    bio = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=200, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    verified = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.full_name} - {self.bio}"


class ContactUs(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200)  # Use EmailField for email addresses
    phone = models.CharField(max_length=200)
    subject = models.CharField(max_length=200)
    message = models.TextField()

    class Meta:
        verbose_name = "Contact Us"
        verbose_name_plural = "Contact Us"

    def __str__(self):
        return self.full_name


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)