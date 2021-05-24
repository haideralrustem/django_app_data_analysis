import pdb
import django
import os
from datetime import datetime, time

import openpyxl
import re
import dateutil.parser
from openpyxl.cell import cell

# print(django.get_version())
nt = '\n\t'
nl = '\n'


s = '05:35'
yourdate = dateutil.parser.parse(s)
print(yourdate)
date_pat1= r'(\d{1,2}(/|-|\\)\d{1,2}(/|-|\\)\d{1,2})|(\d{1,4}(/|-|\\)\d{1,2}(/|-|\\)\d{1,2})|(\d{1,2}(/|-|\\)\d{1,2}(/|-|\\)\d{1,4})'
date_word_pat2 = r'(\d+(/|-|\\)\w{3,8})'

new_date = time(yourdate.hour, yourdate.minute, yourdate.second)

def convert_timedelta(cell_value, desired_unit='hours'):

    final_value = cell_value

    if isinstance(cell_value, datetime.timedelta):

        timedelta_obj = cell_value
        days = timedelta_obj.days
        seconds = timedelta_obj.seconds

        hours = seconds//3600
        minutes = (seconds//60)

        
        if desired_unit == 'days':
            final_value = days + (hours/24)

        elif desired_unit == 'hours':
            final_value = days *24 + (hours)
        
        elif desired_unit == 'minutes':
            final_value = days *1440 + (minutes)

    return final_value


# ...............................

def post_process_excel_rows(rows_list, conversion, desired_unit='hours'):
    new_rows_list = []
    for row in rows_list:
        print(row)
        new_row = {}
        for colname, cell in row.items():
            new_cell = cell
            if conversion == 'timedelta_conversion':
                new_cell = convert_timedelta(cell, desired_unit)
            
            new_row[colname] = new_cell

        new_rows_list.append(new_row)
    
    return new_rows_list
            
# ......................................


def read_excel(file_name):
    wb = openpyxl.load_workbook(file_name)
    print(f'\n\t wb = {wb} \n')
    sheet_obj = wb.active
    cell_obj = sheet_obj.cell(row = 2, column = 1)
        
    #pdb.set_trace()
    print(f'{nt} cell_obj -> {(cell_obj.value)} {nl}')

    print(f'{nt} cell_obj -> {type(cell_obj.value)} {nl}')

    rows_list = []
    headers = []

    for col in sheet_obj.iter_cols():
        # pdb.set_trace()
        headers.append(col[0].value)

    row_num = 0
    for row in sheet_obj.iter_rows():
        if row_num > 0:
            single_row = {}
            c = 0
            for col in headers:
                cell_value = row[c].value
                single_row[col] = cell_value
                c += 1
            
            rows_list.append(single_row)
        row_num += 1
    
    # timedelta_obj = rows_list[2][0]
    # f = convert_timedelta(timedelta_obj, desired_unit='hours')
    
    return headers, rows_list

# ...............................

# def excel_pipeline



headers, rows=read_excel('C:\\Users\\xario\\OneDrive\\Documents\\dataXL.xlsx')
# post_process_excel_rows(rows_list=res)

fx = ('datetime.timedelta hours'.split(' '))
pdb.set_trace()

exit(1)

pth = os.path.dirname(django.__file__)
print(pth)


# ts stores the time in seconds
ts = time.time()
  
# print the current timestamp
print('\n ------->', ts)


recieved_data = [
    {'date': 2006, 'close':40, 'loss': 70 ,'profit': 71},
    {'date': 2008 , 'close': 45, 'loss': 33 ,'profit': 31},
    {'date': 2010, 'close': 48, 'loss': 22 ,'profit': 5},
    {'date': 2012, 'close': 51, 'loss': 29 ,'profit': 30},
    {'date': 2014, 'close': 53, 'loss': 39 ,'profit': 8},
    {'date': 2016, 'close': 57, 'loss': 49 ,'profit': 10},
    {'date': 2017, 'close': 62, 'loss': 51 ,'profit': 40}
]
print('date,', 'close,', 'loss,','profit')
for obj in recieved_data:
    print(obj['date'], ',', obj['close'], ',', obj['loss'], ',', obj['profit'])




