import os
import csv
import re
import json
import pandas as pd
import io

from django.conf import settings
from project1.models import TabularDataSets, MyCsvRow




def prepare_data(file_name, dataset_name):
    
    print('\n\n\n')
    
    # file_path = os.path.join(settings.BASE_DIR, file_name)


    # reader = csv.reader(file_name)
    contents = file_name.read().decode('UTF-8').splitlines()

    reader = csv.DictReader(contents)
    rows = []

    i = 0
    csv_row_headers = []
    for csv_row in reader:
        for key in csv_row.keys():
            csv_row_headers.append(key)
        
        rows.append(csv_row)
        i +=1
     
    return csv_row_headers, rows


#.......................


def detect_datatypes(csv_row_headers, rows):
    #  int - string - float
    dtypes_final_values={}

    dtypes= {}
    for col in csv_row_headers:
        dtypes[col] = []
        for row in rows:

            s = str(row[col]).strip()
            val_type = "string"
            
            x = re.match(r'^[-+]?(\.[0-9]+|[0-9]+\.[0-9]+)$', s)
            
            # Check if float
            if re.match(r'^[-+]?(\.[0-9]+|[0-9]+\.[0-9]+)$', s): 
                val_type = "float"

            # Check if int
            elif re.match(r'^[-+]?[0-9]+$', s):
                val_type = "int"
            elif s == '':
                val_type = "null"
            else:
                val_type = "string"
            
            dtypes[col].append(val_type)


    for col in dtypes.keys():
        dtypes_final_values[col] = 'string'
        types = dtypes[col]
        
        for t in types:
            if t == 'float':
                dtypes_final_values[col] = 'float'
                 # ---->>>>  nullify the rest and keep numbers only -----
                break
            
            if t == 'int':
                c = types.count(t)
                int_proportion = c / len(types)
                string_proportions= types.count('string') / len(types)

                if (int_proportion - string_proportions) > 0.01 :
                    dtypes_final_values[col] = 'int'
                    # ---->>>>  nullify the rest and keep numbers only -----
                    break
                elif (string_proportions - int_proportion) > 0.01:
                    dtypes_final_values[col] = 'string'
                    break

            else:
                string_proportions= types.count('string') / len(types)
                if string_proportions > 0:
                    dtypes_final_values[col] = 'string'
                    break
                



#........................
#  
def post_process_dtypes(dtype_dict, headers, rows):

    return
          


# ........................

def unpack_csvrow_values(row_values, separator='<,>'):

    '2011<,>45'
    
    result_row = []
    separator = r'(?!"){}(?!")'.format(separator)

    escaped = '"{}"'.format(separator)



    a = re.split(separator, row_values)

    b = [re.sub(r'"<,>"', '<,>', x) for x in a]  # remove escapes

    result_row = b

    return result_row


#................................

def convert_rows_to_json(column_names: list , list_of_rows: list):
    py_major_dict = {}

    n = 0
    for row in list_of_rows:
        d = {}
        for i in range(0, len(row)):
            d [column_names[i]] = row[i]

        py_major_dict[n] = d

        n += 1
    
    return json.dumps(py_major_dict)



