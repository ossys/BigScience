from django.urls import path

from rest_framework.routers import DefaultRouter

from . import views

urlpatterns = [
    path('file/prepare', views.Prepare.as_view()),
    path('chunk/upload', views.Upload.as_view()),
]
