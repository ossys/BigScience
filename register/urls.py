from django.urls import path
from django.urls import include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter(trailing_slash=False)
router.register('userprofile', views.UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls))
]
