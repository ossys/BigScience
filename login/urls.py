from django.urls import path

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter(trailing_slash=False)

urlpatterns = [
    path('login', views.Login.as_view()),
]
