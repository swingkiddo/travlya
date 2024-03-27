from django.db import models
import datetime

class TwitchUser(models.Model):
    twitch_id = models.PositiveIntegerField(primary_key=True)
    username = models.CharField(max_length=30)
    display_name = models.CharField(max_length=50)
    rating = models.IntegerField()
    profile_image = models.CharField(max_length=200)
    banned = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
class Suggestion(models.Model):
    user = models.ForeignKey(TwitchUser, on_delete=models.CASCADE, related_name="suggestions")
    url = models.CharField(max_length=150, unique=True)
    embed_url = models.CharField(max_length=200, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    platform = models.CharField(max_length=1, choices={"T": "Twitch", "Y": "Youtube"}, default="Y")

    def __str__(self):
        return self.url
    