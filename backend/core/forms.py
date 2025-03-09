from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User
from core.models import Property, Booking, PropertyReview  # UserProfile

class CustomUserCreationForm(UserCreationForm):
    """ A custom user creation form with additional fields if required. """

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class CustomUserChangeForm(UserChangeForm):
    """ A custom user change form to update user details. """

    class Meta:
        model = User
        fields = ['username', 'email']


# class UserProfileForm(forms.ModelForm):
#     """ A form to enable users to update their profiles. """
#
#     class Meta:
#         model = UserProfile
#         fields = ['bio', 'phone', 'location']  # Adjust fields based on your UserProfile model


class PropertyForm(forms.ModelForm):
    class Meta:
        model = Property
        fields = [
            'realtor',
            'category',
            'title',
            'image',
            'description',
            'price_per_night',
            'max_guests',
            'num_bedrooms',
            'num_bathrooms',
            'location',
            'available',
            'featured',
            'tags'
        ]
        widgets = {
            'tags': forms.CheckboxSelectMultiple()  # Customize the widget for tags if needed
        }

    def __init__(self, *args, **kwargs):
        super(PropertyForm, self).__init__(*args, **kwargs)
        # Additional customizations can be added here if required


# class BookingForm(forms.ModelForm):
#     """ A form for creating a booking. """
#
#     class Meta:
#         model = Booking
#         fields = ['property', 'check_in_date', 'check_out_date', 'guests']
#         widgets = {
#             'check_in_date': forms.DateInput(attrs={'type': 'date'}),
#             'check_out_date': forms.DateInput(attrs={'type': 'date'}),
#             'guests': forms.NumberInput(attrs={'min': 1}),
#         }


class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = [
            'user',               # User making the booking
            'property',           # Property being booked
            'check_in_date',      # Check-in date
            'check_out_date',     # Check-out date
            'guests',             # Number of guests
            'total_price',        # Total price for the booking
            'status',             # Booking status
        ]
        widgets = {
            'check_in_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'check_out_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'total_price': forms.NumberInput(attrs={'step': "0.01"}),  # Allow decimal input
        }

    def clean(self):
        cleaned_data = super().clean()
        check_in_date = cleaned_data.get("check_in_date")
        check_out_date = cleaned_data.get("check_out_date")

        if check_in_date and check_out_date and check_in_date >= check_out_date:
            raise forms.ValidationError("Check-out date must be after check-in date.")

        return cleaned_data


class PropertyReviewForm(forms.ModelForm):

    class Meta:
        model = PropertyReview
        fields = ['property', 'rating', 'comment']  # Adjust fields based on your Review model
        widgets = {
            'comment': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        }

    rating = forms.ChoiceField(choices=[(i, str(i)) for i in range(1, 6)],
                               widget=forms.RadioSelect)

