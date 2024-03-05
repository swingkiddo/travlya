from django.db import models

class TwitchUser(models.Model):
    twitch_id = models.PositiveIntegerField(primary_key=True)
    username = models.CharField(max_length=30)
    rating = models.IntegerField()

class Suggestion(models.Model):
    user = models.ForeignKey(TwitchUser, on_delete=models.CASCADE, related_name="suggestions")
    url = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)