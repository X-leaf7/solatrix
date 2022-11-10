# Split-Side

This repository contains the Split-Side Application. It is a Django Backend with a Next.js static frontend.

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

Happy coding!


### Notes
* Project files will be mounted to the container and changes are reflected automatically.
* Python and Node requirements are installed at container build time, so you have to rebuild if you add requirements.


## Project MetaData
#### Django Version:  4.1
#### Python Version:  3.9.7
#### Postgres:  14.5
