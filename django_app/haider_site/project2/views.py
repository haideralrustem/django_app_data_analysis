from django.shortcuts import render

from django.conf import settings


# Create your views here.

def intro(request):
    context = {'BASE_DIR': settings.BASE_DIR}

    return render(request, 'project2/intro.html', context)

# ..........................

def text_analyzer_main(request):
    context = {}

    return render(request, 'project2/text_analyzer_main.html', context)