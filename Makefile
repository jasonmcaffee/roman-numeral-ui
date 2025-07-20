# Roman Numeral Application Makefile
# Simplified commands for building, running, and stopping the application stack

.PHONY: build-and-run stop

build-and-run:
	@echo "building and running roman-numeral-ui with datadog using command line env var DD_API_KEY: $$DD_API_KEY"
	docker-compose up -d --build

stop:
	@echo "Stopping all containers..."
	docker-compose down
