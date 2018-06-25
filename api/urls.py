from django.urls import path
from django.urls import re_path
from django.conf.urls import include

from rest_framework.routers import DefaultRouter
from rest_framework_jwt.views import obtain_jwt_token

from . import views

router = DefaultRouter()
router.register('hello-viewset', views.HelloViewSet, base_name='hello-viewset')
router.register('profile', views.UserProfileViewSet)
router.register('login', views.LoginViewSet, base_name='login')
router.register('feed', views.UserProfileFeedViewSet)

urlpatterns = [
#     path('auth', obtain_jwt_token),
    re_path(r'^(?P<version>(v1|v2))/hello-view$', views.HelloApiView.as_view()),
    re_path('', include(router.urls))
]
