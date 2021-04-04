import django
import os

print(django.get_version())

pth = os.path.dirname(django.__file__)
print(pth)


