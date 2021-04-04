from django.urls import path
from . import views


# haider
# Ilovemytmnt5


urlpatterns = [
    path('', views.home, name='app1-home'),

    path('about/', views.about, name='app1-about'),

]
