# Split-Side

This repository contains the Split-Side Application. It is a Django Admin Backend with a Next.js static frontend, and socket.io chat server.

## The Django Admin Backend

The django backend exposes REST APIs for a relational data store (Postgres), as well as a CMS for editing portions of the website that should be editable by non-technical staff.

## Next.js static frontend

The user interacts with the application through a Next.js static frontend.

## Socket.io chat server

Chat functionality, such as sending and receiving messages is handled by a node.js server using Socket.io.

## Working Locally

1. [Install Docker](https://docs.docker.com/engine/install/)

2. Run docker-compose from the project root.
```sh
$(ss_django)> docker-compose up
```

3. Hop into the shell on the container
```sh
$(ss_django)> docker exec -it split-side-django-1 /bin/bash
```

4. Create a superuser for yourself.
```sh
~# python manage.py createsuperuser
```

5. Load default CMS data. (Several Frontend pages depend on it to work properly)
```sh
~# python manage.py loaddata cms
```

6. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

7. Create Local DynamoDB Table for Chat messages
```sh
$(ss_django)> export AWS_ACCESS_KEY_ID=FakeKeyId
$(ss_django)> export AWS_SECRET_ACCESS_KEY=FakeSecretAccessKey
$(ss_django)> aws dynamodb create-table --table-name localMessages --attribute-definitions AttributeName=eventId,AttributeType=S AttributeName=messageId,AttributeType=S --key-schema AttributeName=eventId,KeyType=HASH AttributeName=messageId,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:5000 --region ddblocal
```

Happy coding!


### Notes
* Project files will be mounted to the container and changes are reflected automatically.
* Python and Node requirements are installed at container build time, so you have to rebuild if you add requirements.


## Project MetaData
#### Django Version:  4.1
#### Python Version:  3.9.7
#### Postgres:  14.5
