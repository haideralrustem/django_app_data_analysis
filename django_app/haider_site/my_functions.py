import os
import csv
import re
import json

from django.conf import settings
from project1.models import TabularDataSets, MyCsvRow




def prepare_data(file_name, dataset_name):
    # creates a model for each dataset.

    print('\n\n\n')

    csv_table = TabularDataSets(dataset_name=dataset_name)
    if not (TabularDataSets.objects.filter(dataset_name=dataset_name).exists()):
        csv_table.save()
    else:
        csv_table = TabularDataSets.objects.get(dataset_name=dataset_name)

    
    file_path = os.path.join(settings.BASE_DIR, file_name)
    
    rows=[]

    with open(file_path) as f:
        reader = csv.reader(f)

        i = 0
        csv_row_headers = []

        for csv_row in reader:
            query_filters = {}

            if i == 0:
                csv_row_headers = [v for v in csv_row]
                                
            else:

                row = MyCsvRow(parent_dataset_table=csv_table)

                j = 0  
                row_values = ''
                row_variables = ''
                for csv_field in csv_row:

                    csv_field = re.sub(r"<,>", '"<,>"', csv_field)
                    csv_row_headers[j] = re.sub(r"<,>", '"<,>"', csv_row_headers[j])
                    
                    if j > 0:

                        row_values += '<,>'
                        row_variables += '<,>'

                    row_variables += '{}'.format(csv_row_headers[j])
                    row_values += '{}'.format(csv_field)
                    
                    j += 1
                
                row.row_values = row_values
                row.row_variables = row_variables               
                       
                                   
                if not (MyCsvRow.objects.filter(
                        parent_dataset_table__dataset_name=dataset_name,
                        row_values=row_values)
                        .exists()):

                    row.save()

                else:
                    row = MyCsvRow.objects.get(
                          parent_dataset_table__dataset_name=dataset_name,
                          row_values=row_values)

                csv_table.save()
                print('>> ', row)

                rows.append(row)

            
            i += 1

    # rows is a list of MyCsvRow models
    return rows


#...................

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



