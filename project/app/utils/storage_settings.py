from dataclasses import dataclass
from pydantic import BaseSettings


class Settings(BaseSettings):

    class Config:
        env_file = '../../../.env'


class OltpSettings(Settings):
    host: str
    port: str

    class Config:
        env_prefix = 'OLTP_'


@dataclass
class OltpMap:
    database = 'default'
    table = 'items'


oltp_settings = OltpSettings()
