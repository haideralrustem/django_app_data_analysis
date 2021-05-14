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



