import asyncio
from threading import Thread
import json
import re

from django.contrib.auth.decorators import login_required
from django.contrib.sessions.models import Session
from django.shortcuts import render

from app.utils.oltp_client import OltpClient
from app.utils.storage_settings import OltpMap


storage = OltpClient()
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)


def prolong_session(request) -> None:
    try:
        request.session.set_expiry(10*60)
    except Session.DoesNotExist:
        pass


def create_context(user) -> dict:
    user_id = re.sub(r'[^\w.-]', '', str(user))
    return {
        'user': user,
        'user_id': user_id,
        'items': json.dumps(load_data(user_id)),
    }


@login_required
def index(request):
    Thread(target=prolong_session, args=(request,)).start()
    context = create_context(request.user)
    return render(request, 'index.html', context=context)


def save_data(user: str, data: list):
    # Save _TODO items to DB.
    data_to_save = {'_id': user, 'items': data}
    loop.run_until_complete(
        storage.add_data(db_name=OltpMap.database, collection_name=OltpMap.table, data=data_to_save)
    )


def load_data(user: str) -> list:
    # Load _TODO items from DB.
    result = loop.run_until_complete(
        storage.read_data(db_name=OltpMap.database, collection_name=OltpMap.table, id=user)
    )
    if result:
        return result['items']
    return []
