from django.urls import path
from . import views

app_name = 'project1'  # me

urlpatterns = [
    path('', views.main_page_viz, name='main_page'),
    
]