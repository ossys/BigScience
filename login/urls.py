from django.urls import path

from rest_framework.routers import DefaultRouter

from views import Login

router = DefaultRouter(trailing_slash=False)

urlpatterns = [
    path('login', Login.as_view()),
]
