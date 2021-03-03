# Generated by Django 3.1.4 on 2021-03-03 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ArgyleAPIKeys',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client_id', models.CharField(max_length=100)),
                ('client_secret', models.CharField(max_length=100)),
                ('plugin_key', models.CharField(max_length=100)),
                ('is_sandbox_mode', models.BooleanField(default=False)),
                ('webhook_id', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
    ]
