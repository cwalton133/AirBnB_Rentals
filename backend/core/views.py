from django.http import JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.urls import reverse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Avg
#import stripe
from userauths.models import User
from core.models import Property, Booking, PropertyReview, Wishlist, Address
from core.forms import PropertyReviewForm
from rest_framework import viewsets
from .models import (
    PropertyCategory,
    Realtor,
    Property,
    Booking,
    PropertyReview,
    Wishlist,
    Address,
    Amenity,
    PropertyImages,
)
from .serializers import (
    PropertyCategorySerializer,
    RealtorSerializer,
    PropertySerializer,
    BookingSerializer,
    PropertyReviewSerializer,
    WishlistSerializer,
    AddressSerializer,
    AmenitySerializer,
    PropertyImagesSerializer,
)


def index(request):
    # Fetch featured properties for the homepage
    properties = Property.objects.filter(available=True, featured=True).order_by("-date_added")
    context = {
        "properties": properties
    }
    return render(request, 'core/index.html', context)


def property_list_view(request):
    # Show all available properties
    properties = Property.objects.filter(available=True).order_by("-date_added")
    context = {
        "properties": properties,
    }
    return render(request, 'core/property-list.html', context)


def property_detail_view(request, pid):
    property = get_object_or_404(Property, pid=pid)
    reviews = PropertyReview.objects.filter(property=property).order_by("-date")
    average_rating = PropertyReview.objects.filter(property=property).aggregate(rating=Avg('rating'))

    review_form = PropertyReviewForm()

    make_review = True
    if request.user.is_authenticated:
        user_review_count = PropertyReview.objects.filter(user=request.user, property=property).count()
        if user_review_count > 0:
            make_review = False

    context = {
        "property": property,
        "make_review": make_review,
        "review_form": review_form,
        "average_rating": average_rating,
        "reviews": reviews,
    }
    return render(request, "core/property-detail.html", context)


@login_required
def book_property(request, pid):
    if request.method == "POST":
        property = get_object_or_404(Property, pid=pid)
        check_in_date = request.POST.get("check_in")
        check_out_date = request.POST.get("check_out")
        guests = request.POST.get("guests")

        # Create a booking
        booking = Booking.objects.create(
            user=request.user,
            property=property,
            check_in_date=check_in_date,
            check_out_date=check_out_date,
            guests=guests,
        )

        messages.success(request, "Booking successful!")
        return redirect('core:booking_detail', booking.id)
    return render(request, "core/book_property.html", {"property_id": pid})


@login_required
def booking_detail(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    return render(request, "core/booking_detail.html", {"booking": booking})


@login_required
def add_property_review(request, pid):
    if request.method == "POST":
        property = get_object_or_404(Property, pid=pid)
        review_form = PropertyReviewForm(request.POST)
        if review_form.is_valid():
            PropertyReview.objects.create(
                user=request.user,
                property=property,
                review=review_form.cleaned_data['review'],
                rating=review_form.cleaned_data['rating'],
            )
            messages.success(request, "Review added successfully!")
        else:
            messages.error(request, "There was an error adding your review.")
        return redirect("core:property_detail", pid=pid)


@login_required
def wishlist_view(request):
    wishlist = Wishlist.objects.filter(user=request.user)
    context = {
        "wishlist": wishlist,
    }
    return render(request, "core/wishlist.html", context)


def add_to_wishlist(request):
    pid = request.GET['id']
    property = get_object_or_404(Property, pid=pid)
    Wishlist.objects.get_or_create(user=request.user, property=property)
    return JsonResponse({"success": True})


def remove_from_wishlist(request):
    pid = request.GET['id']
    wishlist_item = Wishlist.objects.filter(user=request.user, property__pid=pid).first()
    if wishlist_item:
        wishlist_item.delete()
    return JsonResponse({"success": True})


@login_required
def user_dashboard(request):
    bookings = Booking.objects.filter(user=request.user).order_by("-check_in_date")
    context = {
        "bookings": bookings,
    }
    return render(request, 'core/dashboard.html', context)


@login_required
def make_address_default(request):
    id = request.GET['id']
    Address.objects.update(status=False)
    Address.objects.filter(id=id).update(status=True)
    return JsonResponse({"boolean": True})


def search_view(request):
    query = request.GET.get("q", "")
    properties = Property.objects.filter(title__icontains=query, available=True).order_by("-date_added")
    context = {
        "properties": properties,
        "query": query,
    }
    return render(request, "core/search.html", context)


# Payment related views not included. You can add that based on the previous logic
# implicit in your old code

# Other Pages
def contact(request):
    return render(request, "core/contact.html")


def about_us(request):
    return render(request, "core/about_us.html")


def privacy_policy(request):
    return render(request, "core/privacy_policy.html")


def terms_of_service(request):
    return render(request, "core/terms_of_service.html")


#==========ViesSet for Serializers==================



class PropertyCategoryViewSet(viewsets.ModelViewSet):
    queryset = PropertyCategory.objects.all()
    serializer_class = PropertyCategorySerializer


class RealtorViewSet(viewsets.ModelViewSet):
    queryset = Realtor.objects.all()
    serializer_class = RealtorSerializer


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class PropertyReviewViewSet(viewsets.ModelViewSet):
    queryset = PropertyReview.objects.all()
    serializer_class = PropertyReviewSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer


class PropertyImagesViewSet(viewsets.ModelViewSet):
    queryset = PropertyImages.objects.all()
    serializer_class = PropertyImagesSerializer
