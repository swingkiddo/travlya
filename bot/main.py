from twitchio import Message, User, Chatter
from twitchio.ext import commands
from datetime import datetime
from dateutil import parser
import config
import aiohttp
import requests
import logging
import json
import validators

logger = logging.Logger("bot.logs", level=logging.DEBUG)

ADMIN_IDS = config.ADMIN_IDS
API_URL = config.API_URL

def message_contains_link(message: str) -> bool:
    return True if "http" in message else False

def get_link_from_message(message: str) -> str:
    splitted_message = message.split(" ")
    for word in splitted_message:
        if validators.url(word):
            return word
    return ""

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

# class User:
#     def __init__(self, twitch_id: int, username: str):
#         pass

class InvalidURLError(Exception):
    def __init__(self, *args):
        if args:
            self.message = args[0]
        else:
            self.message = None
    
    def __str__(self):
        if self.message:
            return f"InvalidURLError, {self.message}"
        else:
            return "InvalidURLError has been raised"

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
                
    async def register_user(self, user: User):
        url = f"{API_URL}/users"
        users = await self.fetch_users(ids=[user.id])
        if users:
            user = users[0]
            data = {
                "twitch_id": user.id,
                "username": user.name,
                "display_name": user.display_name,
                "profile_image": user.profile_image,
                "rating": 100
            }
            async with aiohttp.ClientSession() as session:
                async with session.post(url, data=data) as res:
                    if res.status == 201:
                        print(f"user {user.name} registered")
                        self.users.append(user.id)
                    else:
                        print(await res.content.read())
                        print(res.reason)

    async def event_ready(self):
        print(f'Logged in as | {self.nick}')
        print(f'User id is | {self.user_id}')
        users = await self.get_users()
        self.users = [u["twitch_id"] for u in users]
        self.suggestions = {u["twitch_id"]: u["suggestions"] for u in users}
        print(f"{self.users=}")
        print(f"{self.suggestions=}")

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
        # async with aiohttp.ClientSession() as session:
        #     async with session.post(url, data=data) as res:
        #         if res.status != 200:
        #             print("Не удалось отстранить пользователя")
        #             logger.debug(res.text)
        #         print(res.status_code)
        #         print(res.content)
        res = requests.post(url, headers=headers, json=data)
        
        if res.status_code != 200:
            print("Не удалось отстранить пользователя")
            logger.debug(res.text)
        print(res.status_code)
        print(res.content)

    def delete_message(self, broadcaster_id, moderator_id, message_id, user_id, timeput=True):
        url = f"https://api.twitch.tv/helix/moderation/chat?broadcaster_id={broadcaster_id}&moderator_id={moderator_id}&message_id={message_id}"
        headers = {
            "Authorization": f"Bearer {config.TWITCH_TOKEN}",
            "Client-Id": f"{config.CLIENT_ID}",
            "Content-Type": "application/json",
        }
        res = requests.delete(url, headers=headers)

        if res.status_code == 204 and timeput:
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

    def validate_link(self, link):
        if link.count("http") > 1 or not video_is_available(link):
            raise InvalidURLError("Incorrect link or video is unavailable")
        
    async def toggle_sleep(self):
        self.sleep = not self.sleep
        channel = self.connected_channels[0]
        if  not self.sleep:
            await channel.send("сейчас больше с ссылками надо работать")
        else:
            await channel.send("чилю")

    async def handle_travlya(self, link, message, channel_owner):
        author = message.author
        if self.link_already_added(link):
            if self.link_added_by_user(link, author):
                self.delete_message(channel_owner.id, self.user_id, message.id, author.id)
            else:
                await self.connected_channels[0].send(f"@{author.name}, ссылка уже предложена другим пользователем")
        else:
            await self.add_suggestion(author, link)

    async def event_message(self, message: Message):
        print(message.content)
        if message.echo:
            return
        
        author = message.author
        if int(author.id) not in self.users:
            await self.register_user(author)
        content = message.content.strip().split(" ")
        command = content[0]
        args = content[1:] if len(content) > 1 else []
        channel = self.connected_channels[0]
        channel_owner = await channel.user()

        if command == "!sleep":
            if is_admin(author.name):
                await self.toggle_sleep()
        
        if not self.sleep:
            if message_contains_link(message.content):
                link = get_link_from_message(message.content)
                if link and ("youtube" in link or "twitch" in link):
                    if command != "!травля":
                        self.delete_message(channel_owner.id, self.user_id, message.id, author.id)
                    else:
                        await self.handle_travlya(link, message, channel_owner)
    
    async def add_suggestion(self, author: Chatter, suggestion: str):
        url = f"{API_URL}/suggestions"

        if "youtube" in suggestion:
            embed = suggestion.replace("watch?v=", "embed/")
            platform = "Y"
        if "twitch" in suggestion:
            embed = suggestion.replace(".tv/", ".tv/embed?clip=") + "&parent=ae41-185-135-151-155.ngrok-free.app"
            platform = "T"

        data = {
            "user": author.id,
            "url": suggestion,
            "embed_url": embed,
            "platform": platform
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as res:
                if res.status == 201:
                    content = await res.content.read()
                    new_suggestion = json.loads(content)
                    user_id = int(author.id)
                    if not user_id in self.suggestions:
                        self.suggestions[user_id] = [new_suggestion]
                    else:
                        self.suggestions[user_id].append(new_suggestion)
                    print(self.suggestions)
                    text = f"@{author.name}, ссылка добавлена"
                    await self.connected_channels[0].send(text)
                else:
                    print(await res.content.read())

        # await self.handle_commands(message)

    def link_already_added(self, link: str) -> bool:
        added_links = []
        for suggestion_list in self.suggestions.values():
            added_links += [s["url"] for s in suggestion_list]
        if link in added_links:
            return True
        return False

    def link_added_by_user(self, link: str, user: Chatter):
        user_id = int(user.id)
        if user_id in self.suggestions:
            user_links = [sug["url"] for sug in self.suggestions[user_id]]
            if link in user_links:
                return True
        return False

    @commands.command()
    async def hello(self, ctx: commands.Context):
        await ctx.send(f'Hello {ctx.author.name}!')

def video_is_available(url):
    res = requests.get(url)
    if res.status_code == 200 and not "Это видео больше не доступно" in res.text:
        return True
    return False

bot = Bot()
bot.run()
# bot.run() is blocking and will stop execution of any below code here until stopped or closed.
