FROM python:3.12-slim

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry and dependencies
COPY pyproject.toml poetry.lock* /app/backend/
RUN pip install gunicorn
RUN pip install poetry
RUN poetry config virtualenvs.in-project true && poetry install --no-root --without dev

# Copy backend source code
COPY backend/ /app/backend
COPY ../cli /app/cli

# Expose port for Gunicorn (internal to Docker network)
EXPOSE 8000

# Run Gunicorn
CMD ["poetry", "run", "gunicorn", "web.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
