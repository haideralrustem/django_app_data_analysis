from django.shortcuts import render

from django.conf import settings

import pdb
import json

import os

from datetime import datetime, time, timedelta
import time
import string
import csv


# Create your views here.

def intro(request):
    context = {'BASE_DIR': settings.BASE_DIR}

    return render(request, 'project2/intro.html', context)

# ..........................

def text_analyzer_main(request):
    context = {}
    # json_recieved_data = json.dumps(deliver_modded_rows)
    return render(request, 'project2/text_analyzer_main.html', context)