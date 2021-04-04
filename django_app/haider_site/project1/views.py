from django.shortcuts import render

# me
import my_functions
from django.conf import settings


import os
import csv




# Create your views here.

def main_page_viz(request):  
    file_path = os.path.join(settings.BASE_DIR, '')
    
    rows=[]
    file_name = 'app1\\static\\csv_files\\data2.csv'

    file_path = os.path.join(settings.BASE_DIR, file_name)

    # pipeline to open csv, save the data to a TabularDataSets model
    rows = my_functions.prepare_data(file_name=file_name, dataset_name='first_dummy')
    new_rows = []
    # get only the colummn names
    column_names = my_functions.unpack_csvrow_values(rows[0].row_variables)
    for r in rows:
        single_row = my_functions.unpack_csvrow_values(row_values=r.row_values)
        new_rows.append(single_row)
        
    json_string_dict = my_functions.convert_rows_to_json(column_names=column_names, 
                                            list_of_rows=new_rows)  
        
    

    context = {
        'data_array': [1, 2, 3, 4 , 5],
        'rows': rows,
        'BASE_DIR': settings.BASE_DIR,
        'file_path': file_path,
        'debug_vars': {
            'json_string_dict': json_string_dict
        }
    }


    return render(request, 'project1/main_page.html', context)