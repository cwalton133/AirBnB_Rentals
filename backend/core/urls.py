from django import views
from django.urls import path, include
from core.views import (
    index,
    property_list_view,
    property_detail_view,
    book_property,
    add_property_review,
    wishlist_view,
    add_to_wishlist,
    remove_from_wishlist,
    user_dashboard,
    search_view,
    make_address_default,
    contact,
    about_us,
    privacy_policy,
    terms_of_service,
)
from rest_framework.routers import DefaultRouter
from .views import (
    PropertyCategoryViewSet,
    RealtorViewSet,
    PropertyViewSet,
    BookingViewSet,
    PropertyReviewViewSet,
    WishlistViewSet,
    AddressViewSet,
    AmenityViewSet,
    PropertyImagesViewSet,
)


# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'property-categories', PropertyCategoryViewSet)
router.register(r'realtors', RealtorViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'property-reviews', PropertyReviewViewSet)
router.register(r'wishlists', WishlistViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'property-images', PropertyImagesViewSet)

app_name = "core"

urlpatterns = [

    # Homepage
# The API URLs are now determined automatically by the router.
    path('api/', include(router.urls)),
    path("", index, name="index"),
    # Property URLs
    path("properties/", property_list_view, name="property-list"),
    path("property/<str:pid>/", property_detail_view, name="property-detail"),
    path("property/<str:pid>/book/", book_property, name="book-property"),
    path("property/<str:pid>/review/", add_property_review, name="add-property-review"),

    # User Dashboard
    path("dashboard/", user_dashboard, name="dashboard"),

    # Wishlist URLs
    path("wishlist/", wishlist_view, name="wishlist"),
    path("wishlist/add/", add_to_wishlist, name="add-to-wishlist"),
    path("wishlist/remove/", remove_from_wishlist, name="remove-from-wishlist"),

    # Search
    path("search/", search_view, name="search"),

    # Address Management
    path("make-default-address/", make_address_default, name="make-default-address"),

    # Static Pages
    path("contact/", contact, name="contact"),
    path("about-us/", about_us, name="about_us"),
    path("privacy-policy/", privacy_policy, name="privacy_policy"),
    path("terms-of-service/", terms_of_service, name="terms_of_service"),
]
