# Generated by Django 3.0.8 on 2020-09-01 04:18

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='info',
            old_name='content',
            new_name='section_text',
        ),
        migrations.RenameField(
            model_name='info',
            old_name='title',
            new_name='section_title',
        ),
        migrations.AlterField(
            model_name='info',
            name='date_posted',
            field=models.DateTimeField(default=datetime.datetime(2020, 9, 1, 4, 17, 51, 405997, tzinfo=utc)),
        ),
    ]
