"""
Items storage client.

This is MongoDB storage, that is convenient option for storing unstructured data,
such as users _TODO items.

"""

import motor.motor_asyncio
from pymongo import errors

from app.utils.storage_settings import oltp_settings


class OltpClient:

    def __init__(self):
        self.client = motor.motor_asyncio.AsyncIOMotorClient(f'{oltp_settings.host}:{oltp_settings.port}/')

    async def add_data(self, db_name: str, collection_name: str, data: dict):
        db = self.client[db_name]
        collection = db[collection_name]
        try:
            await collection.insert_one(data)
        except errors.DuplicateKeyError:
            await collection.update_one({'_id': data['_id']}, {'$set': {'items': data['items']}})

    async def read_data(self, db_name: str, collection_name: str, id: str):
        db = self.client[db_name]
        collection = db[collection_name]
        return await collection.find_one({'_id': id})

    async def remove_collection(self, db_name: str, collection_name: str):
        db = self.client[db_name]
        await db[collection_name].drop()
