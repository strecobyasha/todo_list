#!/bin/bash

exec gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker -c /opt/app/gunicorn.conf.py

"$@"
