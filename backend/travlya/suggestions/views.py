from django.shortcuts import render
from django.http import Http404
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Suggestion, TwitchUser

import datetime

from suggestions.serializers import GroupSerializer, UserSerializer, SuggestionSerializer, TwitchUsesrSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class SuggestionList(APIView):
    def get_object(self, pk):
        try:
            return Suggestion.objects.get(pk=pk)
        except Suggestion.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        params = request.query_params
        if params and "platform" in params:
            platform = "Y" if params["platform"] == "youtube" else "T"
            suggestions = Suggestion.objects.filter(platform=platform)
        else:
            suggestions = Suggestion.objects.all()
        serializer = SuggestionSerializer(suggestions, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        print(request.data)
        serializer = SuggestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        suggestion = self.get_object(pk)
        suggestion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class TwitchUserList(APIView):
    def get_object(self, pk):
        try:
            return TwitchUser.objects.get(pk=pk)
        except TwitchUser.DoesNotExist:
            raise Http404
    
    def get(self, request, format=None):
        users = TwitchUser.objects.filter(
            banned=False
        ).exclude(
            suggestions__isnull=True,
        ).order_by("-rating")
        serializer = TwitchUsesrSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = TwitchUsesrSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        user = TwitchUser.objects.get(twitch_id=pk)
        serializer = TwitchUsesrSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)