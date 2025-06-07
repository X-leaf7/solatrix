#!/bin/bash

# Activate virtual environment
source /home/ubuntu/split-side/admin/venv/bin/activate

# Navigate to project directory
cd /home/ubuntu/split-side/admin

# Export environment variables from .env
export $(cat .env | xargs)

# Run Django server
exec python3 manage.py runserver 0.0.0.0:8000
