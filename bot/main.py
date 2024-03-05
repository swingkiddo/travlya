from twitchio import Message, User
from twitchio.ext import commands
from datetime import datetime
from dateutil import parser
import config
import aiohttp
# import requests
import logging

logger = logging.Logger("bot.logs", level=logging.DEBUG)

ADMIN_IDS = config.ADMIN_IDS
API_URL = config.API_URL

def message_contains_link(message: str) -> bool:
    return True if "http" in message else False

def get_link_from_message(message: str) -> str:
    splitted_message = message.split(" ")
    for word in splitted_message:
        if word.startswith("http"):
            return word

def whisper_to_user(text, from_id, user_id):
    url = f"https://api.twitch.tv/helix/whispers?from_user_id={from_id}&to_user_id={user_id}"
    headers = {
        "Authorization": f"Bearer {config.TWITCH_TOKEN}",
        "Client-Id": f"{config.CLIENT_ID}",
        "Content-Type": "application/json",
    }
    res = requests.post(url, json={"message": text}, headers=headers)
    print(res.status_code)
    print(res.content)

def is_admin(id):
    return True if id in ADMIN_IDS else False

class User:
    def __init__(self, twitch_id: int, username: str):
        pass
        
class Suggestion:
    def __init__(self, url: str, user: User, timestamp: datetime):
        self.url = url
        self.user = user
        self.timestamp = timestamp

    @classmethod
    def parse_from_json(cls, json):
        url = json["url"]
        user_id = json["user"]
        timestamp = parser.parse(json["timestamp"])
        suggestion = cls(url, user_id, timestamp)
        return suggestion

class Bot(commands.Bot):
    def __init__(self):
        super().__init__(token=config.TWITCH_TOKEN, prefix=config.PREFIX, initial_channels=config.CHANNELS)
        self.suggestions = {}
        self.timeouts = {}
        self.delete_counters = {}
        self.users = []
        self.sleep = False

    async def get_suggestions(self):
        url = f"{API_URL}/suggestions"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as res:
                if res.status == 200:
                    suggestions = await res.json()
                    return suggestions
    
    async def get_users(self):
        url = f"{API_URL}/users"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as res:
                if res.status == 200:
                    users = await res.json()
                    return users
                
    async def register_user(self, data):
        url = f"{API_URL}/users"
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as res:
                if res.status == 201:
                    pass

    async def event_ready(self):
        print(f'Logged in as | {self.nick}')
        print(f'User id is | {self.user_id}')
        users = await self.get_users()
        self.users = [u["twitch_id"] for u in users]
        self.suggestions = {u["twitch_id"]: u["suggestions"] for u in users}

    def timeout_user(self, channel_id, moderator_id, user_id):
        print(self.timeouts)
        duration = 10
        if user_id in self.timeouts:
            duration = self.timeouts[user_id] * 2
        self.timeouts[user_id] = duration

        url = f"https://api.twitch.tv/helix/moderation/bans?broadcaster_id={channel_id}&moderator_id={moderator_id}"
        headers = {
            "Authorization": f"Bearer {config.TWITCH_TOKEN}",
            "Client-Id": f"{config.CLIENT_ID}",
            "Content-Type": "application/json"
        }
        data = {
            "data": {
                "user_id": user_id, 
                "duration": duration, 
                "reason": "no reason"
            }
        }
        res = requests.post(url, headers=headers, json=data)
        
        if res.status_code != 200:
            print("Не удалось отстранить пользователя")
            logger.debug(res.text)
        print(res.status_code)
        print(res.content)

    def delete_message(self, broadcaster_id, moderator_id, message_id, user_id):
        url = f"https://api.twitch.tv/helix/moderation/chat?broadcaster_id={broadcaster_id}&moderator_id={moderator_id}&message_id={message_id}"
        headers = {
            "Authorization": f"Bearer {config.TWITCH_TOKEN}",
            "Client-Id": f"{config.CLIENT_ID}",
            "Content-Type": "application/json",
        }
        res = requests.delete(url, headers=headers)

        if res.status_code == 204:
            if user_id not in self.delete_counters:
                self.delete_counters[user_id] = 1
            else:
                self.delete_counters[user_id] += 1
            
            print(self.delete_counters)
            if self.delete_counters[user_id] >= 3:
                self.timeout_user(broadcaster_id, moderator_id, user_id)
        else:
            print(res.text)
            logger.debug(res.text)

    async def event_message(self, message: Message):
        if message.echo:
            return
        
        author = message.author
        content = message.content.strip()
        command = content.split(" ")[0]
        channel = self.connected_channels[0]
        channel_owner = await channel.user()

        if command == "!sleep":
            if is_admin(author.name):
                self.sleep = not self.sleep
                if  not self.sleep:
                    await channel.send("сейчас больше с ссылками надо работать")
                else:
                    await channel.send("чилю")
        
        if not self.sleep:
            if message_contains_link(content):
                link = get_link_from_message(content)
                if not "!травля" in content:
                    self.delete_message(channel_owner.id, self.user_id, message.id, author.id)

                if command == "!травля":
                    splitted = message.content.split(" ")
                    if len(splitted) > 1:
                        link = get_link_from_message(content)
                        if self.link_already_added(link):
                                self.delete_message(channel_owner.id, self.user_id, message.id, author.id)
                        else:
                            await self.add_suggestion(author, link)
    
    async def add_suggestion(self, author: User, suggestion: str):
        if not author.id in self.suggestions:
            self.suggestions[author.id] = [suggestion]
        else:
            # for s in suggestions:
                # if s in suggestion:
                #     self.
            self.suggestions[author.id].append(suggestion)
        print(self.suggestions)
        text = f"@{author.name}, ссылка добавлена"
        await self.connected_channels[0].send(text)

        # await self.handle_commands(message)

    def link_already_added(self, link: str) -> bool:
        suggestions = []
        for s in self.suggestions.values():
            suggestions.append(*s)
        if link in suggestions:
            return True
        return False

    @commands.command()
    async def hello(self, ctx: commands.Context):
        await ctx.send(f'Hello {ctx.author.name}!')


bot = Bot()
bot.run()
# bot.run() is blocking and will stop execution of any below code here until stopped or closed.
