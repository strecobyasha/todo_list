include .env

env_file = --env-file .env
app = project

help:
	@echo "Makefile commands:"
	@echo "build"
	@echo "stop"
	@echo "restart"
	@echo "destroy"
	@echo "collect_static"
	@echo "migrate"
	@echo "app_connect"
build:
	docker-compose -f docker-compose.yml build $(c)
	docker-compose -f docker-compose.yml up -d $(c)
stop:
	docker-compose -f docker-compose.yml stop $(c)
restart:
	docker-compose -f docker-compose.yml stop $(c)
	docker-compose -f docker-compose.yml up -d $(c)
destroy:
	docker system prune -a -f --volumes $(c)
collect_static:
	docker-compose exec ${app} ./manage.py collectstatic --noinput
migrate:
	docker-compose exec ${app} python ./manage.py migrate
app_connect:
	docker exec -it ${app} sh
