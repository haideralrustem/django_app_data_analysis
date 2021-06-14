from django.urls import path
from . import views

app_name = 'project1'  # me

urlpatterns = [
    
    path('', views.data_file_upload, name='data_file_upload'),
    path('/viz', views.main_page_viz, name='main_page'),
    path('/testing', views.testing_page, name='testing_page'),

    # ajax requests
    path('/ajax/post/accept_uploaded_data', views.accept_uploaded_data, name="accept_uploaded_data"),
    #auto_detect_data
    path('/ajax/post/auto_detect_data', views.auto_detect_data, name="auto_detect_data"),
    path('/ajax/post/change_col_dtype', views.change_col_dtype, name="change_col_dtype"),
  
]