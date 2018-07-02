from django.urls import path

from rest_framework.routers import DefaultRouter

from . import views

urlpatterns = [
    path('upload', views.Upload.as_view()),
]
