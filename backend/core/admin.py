from django.contrib import admin
from core.models import (
    Property,
    Booking,
    PropertyReview,
    #UserProfile,
    Amenity,
    PropertyImages,
    Wishlist,
    Address,
)
from ckeditor.widgets import CKEditorWidget
from django import forms

class PropertyImagesAdmin(admin.TabularInline):
    model = PropertyImages
    extra = 1  # To allow adding new images easily

class PropertyAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorWidget())

    class Meta:
        model = Property
        fields = '__all__'


class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImagesAdmin]
    list_display = ['title', 'image', 'realtor', 'price_per_night', 'location', 'available']
    list_editable = ['price_per_night', 'available']
    search_fields = ['title', 'realtor__username']
    list_filter = ['available', 'location', 'tags']
    form = PropertyAdminForm

class BookingAdmin(admin.ModelAdmin):
    list_display = ['property', 'user', 'check_in_date', 'check_out_date', 'status']
    list_editable = ['status']
    search_fields = ['user__username', 'property__title']
    list_filter = ['status', 'check_in_date', 'check_out_date']

class PropertyReviewAdmin(admin.ModelAdmin):
    list_display = ['property', 'user', 'rating', 'date']
    search_fields = ['user__username', 'property__title']
    list_filter = ['rating', 'date']

# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ['user', 'bio', 'phone', 'location']
#     search_fields = ['user__username', 'bio']

class AmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']

class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'property', 'date_added']  # Correctly referencing 'date_added'
    search_fields = ['user__username', 'property__title']  # Ensure property has title for better search
    list_filter = ['user', 'date_added']

class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'address_line', 'city', 'state', 'zip_code']
    list_editable = ['address_line', 'city', 'state', 'zip_code']


# Register models with their corresponding admin classes
admin.site.register(Property, PropertyAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(PropertyReview, PropertyReviewAdmin)
#admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Amenity, AmenityAdmin)
admin.site.register(Wishlist, WishlistAdmin)
admin.site.register(Address, AddressAdmin)