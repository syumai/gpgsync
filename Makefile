PROJECT_NAME="gpgsync"
PORT?=8080

.PHONY: deploy
deploy:
	gcloud app deploy --project $(PROJECT_NAME)
