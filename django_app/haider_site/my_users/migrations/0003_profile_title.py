# Generated by Django 3.0.8 on 2020-09-13 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_users', '0002_auto_20200912_1757'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='title',
            field=models.CharField(default='Profile Title', max_length=250),
        ),
    ]