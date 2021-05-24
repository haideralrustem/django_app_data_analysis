from django.shortcuts import render

from django.http import JsonResponse
from django.core import serializers

# me
import my_functions
from django.conf import settings

import os
from datetime import datetime
import time
import csv
# import sys
# sys.path.append("..")
# import my_functions



# Create your views here.

def data_file_upload(request):
    

    if request.method == 'POST':
        
        
        y_names = []
        file_path = os.path.join(settings.BASE_DIR, '')
        rows=[]
        file_name = 'app1\\static\\csv_files\\data2.csv'

        uploaded_file = request.FILES['uploaded_file']
        # file_path = os.path.join(settings.BASE_DIR, file_name)

        # pipeline to open csv, save the data to a TabularDataSets model
        dataset_name = "dataset_"+ str(time.time())

        y_names, rows = my_functions.prepare_data(file_name=uploaded_file, dataset_name=dataset_name)
        
        dtypes_values = my_functions.detect_datatypes(y_names, rows)
        print('\n modded rows: \n')
        mrows = my_functions.post_process_dtypes(dtypes_values, y_names, rows)
        
        for mr in rows:
            print(mr)
        
        mrows, new_dtypes_values = my_functions.manual_cahnge_data_type(
            dtypes_values, {'close': 'string'}, y_names, mrows)

       

        # get only the colummn names
        # column_names = my_functions.unpack_csvrow_values(rows[0].row_variables)
        # for r in rows:
        #     single_row = my_functions.unpack_csvrow_values(row_values=r.row_values)
        #     new_rows.append(single_row)
            
        # json_string_dict = my_functions.convert_rows_to_json(column_names=column_names, 
        #                                         list_of_rows=new_rows)
        
        context = {'uploaded_file': uploaded_file, 'rows': rows, 'y_names': y_names}
        return render(request, 'project1/presets_config.html', context)

    else:
        context = {'uploaded_file': 'no file uploaded!, ERROR'}
        return render(request, 'project1/presets_config.html', context)


# ........................................


def main_page_viz(request):  
      
    file_path = os.path.join(settings.BASE_DIR, '')
    

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
       
        'BASE_DIR': settings.BASE_DIR,
        'file_path': file_path,
        'debug_vars': {
            'json_string_dict': ''

        },
        'recieved_data': recieved_data,
        
        
    }

    # return render(request, 'project1/main_page.html', context)
    return render(request, 'project1/main_page.html', context)

