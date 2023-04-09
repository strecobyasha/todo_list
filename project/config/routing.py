from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/<str:user>/", consumers.TodoListConsumer.as_asgi())
]
