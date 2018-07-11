"""BigScience URL Configuration"""
from django.contrib import admin
from django.urls import include
from django.urls import path

urlpatterns = [
    path('admin', admin.site.urls),
    path('api/', include('user.urls')),
    path('api/', include('file.urls')),
]
