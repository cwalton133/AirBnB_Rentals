from django import views
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
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
    initiate_payment, 
    process_payment, 
    PaymentViewSet
    
)


# My router
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
router.register(r'payments', PaymentViewSet)



app_name = "core"

urlpatterns = [

# API  Endpoints URLs 
    path('api/', include(router.urls)),
    path("", index, name="index"),
    # Property URLs
    path("property/", property_list_view, name="property-listing"),
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

    # Address URL
    path("make-default-address/", make_address_default, name="make-default-address"),
    
    #Payment URL
    path("payment/initiate/<int:booking_id>/", initiate_payment, name="initiate-payment"),
    path("initiate-payment/<int:booking_id>/", initiate_payment, name="initiate_payment"),
    path("payment/process/<int:payment_id>/", process_payment, name="process-payment"),
    #path("payment/initiate/<int:booking_id>/", lambda request, booking_id: initiate_payment(request, booking_id), name="initiate-payment"),


    # Static Pages
    path("contact/", contact, name="contact"),
    path("about-us/", about_us, name="about_us"),
    path("privacy-policy/", privacy_policy, name="privacy_policy"),
    path("terms-of-service/", terms_of_service, name="terms_of_service"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)