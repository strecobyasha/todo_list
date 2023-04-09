import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from app.views import load_data, save_data


class TodoListConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = self.scope['url_route']['kwargs']['user']
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data: str):
        task = json.loads(text_data).get('task')
        user = json.loads(text_data).get('user')

        if task == 'save':
            data = json.loads(text_data).get('data')
            await sync_to_async(save_data, thread_sensitive=True)(user=user, data=data)
            await self.send(text_data=json.dumps({
                'message': 'saved',
            }))
