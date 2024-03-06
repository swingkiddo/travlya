from django.contrib.auth.models import Group, User
from .models import TwitchUser, Suggestion 
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "name"]


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = ["url", "embed_url", "user", "timestamp"]

    # def create(self, validated_data):
    #     print(validated_data)
    #     user_id = validated_data.pop("user")
    #     user = TwitchUser.objects.get(twitch_id=user_id)
    #     suggestion = Suggestion.objects.create(**validated_data, user=user)
    #     return suggestion

class TwitchUsesrSerializer(serializers.ModelSerializer):
    suggestions = SuggestionSerializer(many=True, read_only=True)
    class Meta:
        model = TwitchUser
        fields = ["twitch_id", "username", "suggestions", "rating", "display_name", "profile_image"]