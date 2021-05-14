from django.shortcuts import render



from django.http import JsonResponse
from django.core import serializers
# me
import my_functions
from django.conf import settings

import os
import csv




# ajax post requests
def data_file_upload(request):
    if request.method == 'POST' and request.is_ajax():
            y_names = []
            return JsonResponse({'status':'Success', 'msg': 'save successfully uploaded', 
                                 'new_username': y_names})
    else:
        return JsonResponse({'status':'Fail', 'msg':'Upload ERROR!!'})


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
        
    
    recieved_data = [
        {'date': 2006, 'close':40, 'loss': 70 ,'profit': 71},
        {'date': 2008 , 'close': 45, 'loss': 33 ,'profit': 31},
        {'date': 2010, 'close': 48, 'loss': 22 ,'profit': 5},
        {'date': 2012, 'close': 51, 'loss': 29 ,'profit': 30},
        {'date': 2014, 'close': 53, 'loss': 39 ,'profit': 8},
        {'date': 2016, 'close': 57, 'loss': 49 ,'profit': 10},
        {'date': 2017, 'close': 62, 'loss': 51 ,'profit': 40}
    ]

    context = {
        'data_array': [1, 2, 3, 4 , 5],
        'rows': rows,
        'BASE_DIR': settings.BASE_DIR,
        'file_path': file_path,
        'debug_vars': {
            'json_string_dict': json_string_dict
        },
        'recieved_data': recieved_data,
        
    }


    # return render(request, 'project1/main_page.html', context)
    return render(request, 'project1/presets_config.html', context)