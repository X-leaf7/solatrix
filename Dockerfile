ARG PYTHON_VERSION=3.9

# Build dependencies in separate container
FROM public.ecr.aws/docker/library/python:${PYTHON_VERSION}-slim as builder
ENV WORKDIR /app
ADD requirements ${WORKDIR}/requirements

RUN cd ${WORKDIR} \
    && pip install --upgrade pip \
    && pip install -r requirements/base.txt 

# Create the final container with the app
FROM public.ecr.aws/docker/library/python:${PYTHON_VERSION}-slim

ENV USER=docker \
    GROUP=docker \
    UID=12345 \
    GID=23456 \
    HOME=/app \
    PYTHONUNBUFFERED=1

WORKDIR ${HOME}

# Copy installed packages
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
# Copy the application
COPY --chown=docker:docker . .
# Collect the static files
RUN python manage.py collectstatic --noinput

EXPOSE 80

CMD ["./run-web.sh"]