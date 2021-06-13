
from django.shortcuts import render
from .forms import UploadedDataFormHandler, GenericValueForm, GenericMultichoiceForm
from django.http import JsonResponse
from django.core import serializers
# import django.contrib.sessions

# me
import my_functions

from django.conf import settings
import pdb

import os
from datetime import datetime
import time
import string
import csv
# import sys
# sys.path.append("..")
# import my_functions

# persistent vars
persistent_data_state = {}

# AJAX Reqs
def accept_uploaded_data(request):

    print('\n\n\n accept_uploaded_data@  views.py has been hit \n\n\n')
    if request.method == 'POST' and request.is_ajax():
        
        u_form = UploadedDataFormHandler(request.POST)
        # save the data and after fetch the object in instance
        if u_form.is_valid():
            accept_value = u_form.cleaned_data['accept_value']   

            
            # pass session variables ??? <<<<<<<
            if accept_value == 'true':
                
                rows = persistent_data_state['rows'] 
                headers = persistent_data_state['headers'] 
                original_dtypes_values = persistent_data_state['original_dtypes_values'] 
                str_rows = persistent_data_state['str_rows'] 
                modded_rows = persistent_data_state['modded_rows'] 
                new_dtypes_values = persistent_data_state['new_dtypes_values'] 

                data_state = {
                'headers': headers, 'original_dtypes_values': original_dtypes_values,
                'str_rows': str_rows,
                'new_dtypes_values': new_dtypes_values
                }
                

                return JsonResponse({                                    
                'msg': 'accept_value posted successfully', 
                                    'accept_value': accept_value,
                                    }, status=200)

            return JsonResponse({
                                 'msg': 'form was valid but but accept_value was false',
                                 'accept_value': accept_value,
                                 }, status=400)
        
        else:
            return JsonResponse({'msg':'Form was not valid'}, status=400)

    return JsonResponse({'status':'Fail', 'msg':'Not a valid request'}, status=400)

# .........................

def change_col_dtype(request):
    print('\n\n\n change_col_dtype @  views.py has been hit \n\n\n')
    if request.method == 'POST' and request.is_ajax():
        
        u_form = GenericValueForm(request.POST)
        
        if u_form.is_valid():
            print('\n\n u_form \n\n', u_form.cleaned_data)
            text_key = u_form.cleaned_data['text_key']
            text_value = u_form.cleaned_data['text_value']

            # retrieve the original data
            rows = persistent_data_state['rows']
            headers = persistent_data_state['headers']
            original_dtypes_values = persistent_data_state['original_dtypes_values']
            str_rows = persistent_data_state['str_rows']

            # current rows (which could be modded) and dtypes
            current_modded_rows = persistent_data_state['modded_rows']
            current_dtypes_values = persistent_data_state['new_dtypes_values']

            current_dtypes_values_readable = persistent_data_state['new_dtypes_values_readable'] 
            
            target_dtype = my_functions.reverse_readable_dtype_value(text_value)
            colname = text_key
            index_of_colname = headers.index(colname) # needed to target table cells

            target_change_cols = { colname : target_dtype }
            
            modded_rows, ndtypes = my_functions.manual_change_data_type(
                                                dtypes_values=current_dtypes_values, 
                                                target_change_cols=target_change_cols, 
                                                headers=headers, 
                                                rows=rows)
            # str_rows is just for the view
            str_modded_rows = my_functions.stringfy_data(ndtypes, headers, modded_rows)

            persistent_data_state['modded_rows'] = modded_rows
            persistent_data_state['new_dtypes_values'] = ndtypes

            return JsonResponse({                                    
                    'msg': 'change dtype posted successfully', 
                                        'selected_header': text_key,
                                        'selected_value': text_value,
                                        'selected_header_index': index_of_colname,
                                        'str_modded_rows': str_modded_rows
                                        }, status=200) 
        else:
            return JsonResponse({'msg': 'error form was not valid', 
                                }, status=400)



# Create your views here.

def data_file_upload(request):
    
    if request.method == 'POST' and not request.is_ajax():  # file upload 
        # pdb.set_trace()
        y_names = []
        file_path = os.path.join(settings.BASE_DIR, '')
        rows=[]
        file_name = 'app1\\static\\csv_files\\data2.csv'

        if 'uploaded_file' in request.FILES:
            uploaded_file = request.FILES['uploaded_file']
        else:
            return render(request, 'project1/presets_config.html')
        # file_path = os.path.join(settings.BASE_DIR, file_name)

        # pipeline to open csv, save the data to a TabularDataSets model
        dataset_name = "dataset_"+ str(time.time())
                        
        headers, rows = my_functions.prepare_data(file_name=uploaded_file, dataset_name=dataset_name)
        original_dtypes_values = my_functions.detect_datatypes(headers, rows)
        original_dtypes_values_readable = my_functions.convert_to_readable_dtype_value(
                                                       original_dtypes_values)

        
        # str_header_and_rows = 

        modded_rows, new_dtypes_values = my_functions.post_process_dtypes(
                                                            original_dtypes_values, 
                                                            headers, rows)

        str_rows = my_functions.stringfy_data(original_dtypes_values, headers, rows)
        str_modded_rows = my_functions.stringfy_data(original_dtypes_values, headers, modded_rows)

        new_dtypes_values_readable = my_functions.convert_to_readable_dtype_value(new_dtypes_values)
        
                                                          
        # pdb.set_trace()
        # user presented with a choice
        # modded_rows2, new_dtypes_values2 = manual_change_data_type(original_dtypes_values, {'date': 'datetime.timedelta minutes'}
        #                         , headers, rows)       
        
       

        # get only the colummn names
        # column_names = my_functions.unpack_csvrow_values(rows[0].row_variables)
        # for r in rows:
        #     single_row = my_functions.unpack_csvrow_values(row_values=r.row_values)
        #     new_rows.append(single_row)
            
        # json_string_dict = my_functions.convert_rows_to_json(column_names=column_names, 
        #                                         list_of_rows=new_rows)
        uploaded_data_form_handler = UploadedDataFormHandler(initial={'accept_value': 'false'})
        change_dtype_form = GenericValueForm()

        choices = [ch for ch in original_dtypes_values_readable.keys()]
        change_dtype_form_multi = GenericMultichoiceForm(custom_choices=choices)
        
        context = {'uploaded_file': uploaded_file, 'rows': rows, 
                    'headers': headers, 
                    'original_dtypes_values': original_dtypes_values,
                    'str_rows': str_rows,
                    'str_modded_rows': str_modded_rows,
                    'modded_rows': modded_rows, 'new_dtypes_values': new_dtypes_values,
                    'original_dtypes_values_readable': original_dtypes_values_readable,
                    'original_dtypes_values_readable_length': len(original_dtypes_values_readable),
                    'uploaded_data_form_handler': uploaded_data_form_handler,
                    'change_dtype_form': change_dtype_form,
                    'change_dtype_form_multi': change_dtype_form_multi,
                    }

        persistent_data_state['rows'] = rows
        persistent_data_state['headers'] = headers
        persistent_data_state['original_dtypes_values'] = original_dtypes_values
        persistent_data_state['str_rows'] = str_rows
        persistent_data_state['modded_rows'] = modded_rows
        persistent_data_state['new_dtypes_values'] = new_dtypes_values
        persistent_data_state['new_dtypes_values_readable'] = new_dtypes_values_readable
        

        return render(request, 'project1/presets_config.html', context)

    else:
        change_dtype_form = GenericValueForm()
        context = {'uploaded_file': 'no file uploaded!, ERROR',
                    'change_dtype_form': change_dtype_form}
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



def testing_page(request):
        
    return render(request, 'project1/testing_page.html', {})