from django.urls import path
from django.urls import include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter(trailing_slash=False)

urlpatterns = [
#     path('user', views.UserCreateView.as_view()),
    path('login', views.LoginAPIView.as_view()),
#     path('user', views.UserUpdateView.as_view()),
]
