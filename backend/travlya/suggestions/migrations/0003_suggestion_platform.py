# Generated by Django 5.0.2 on 2024-03-20 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suggestions', '0002_twitchuser_banned'),
    ]

    operations = [
        migrations.AddField(
            model_name='suggestion',
            name='platform',
            field=models.CharField(choices=[('T', 'Twitch'), ('Y', 'Youtube')], default='Y', max_length=1),
        ),
    ]
