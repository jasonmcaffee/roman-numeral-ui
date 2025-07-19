# Roman Numeral Application Makefile
# Simplified commands for building, running, and stopping the application stack

.PHONY: build-and-run stop

build-and-run:
	@echo "building and running roman-numeral-ui..."
	docker-compose up -d --build

stop:
	@echo "Stopping all containers..."
	docker-compose down
