import django
import os
from datetime import datetime
import time


print(django.get_version())

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




