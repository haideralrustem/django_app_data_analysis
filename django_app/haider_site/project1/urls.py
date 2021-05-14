from django.urls import path
from . import views

app_name = 'project1'  # me

urlpatterns = [
    path('', views.main_page_viz, name='main_page'),

    path('post/ajax/data_file_upload', views.data_file_upload, name='data_file_upload'),
    
]