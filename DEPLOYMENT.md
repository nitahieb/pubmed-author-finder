# PubMed Author Finder - Web Application Deployment Guide

This guide covers how to deploy the PubMed Author Finder web application.

## Development Setup

### Prerequisites
- Python 3.10 or higher
- Poetry (for dependency management)

### Running Locally

1. **Clone the repository:**
```bash
git clone https://github.com/nitahieb/pubmed-author-finder.git
cd pubmed-author-finder
```

2. **Install dependencies:**
```bash
poetry install
```

3. **Start the development server:**
```bash
cd src
poetry run python webapp.py
```

The application will be available at `http://localhost:5000`

## Production Deployment

### Using Gunicorn (Recommended)

1. **Install Gunicorn:**
```bash
poetry add gunicorn
```

2. **Create a Gunicorn configuration file** (`gunicorn.conf.py`):
```python
bind = "0.0.0.0:5000"
workers = 4
timeout = 120
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

3. **Run with Gunicorn:**
```bash
cd src
poetry run gunicorn --config ../gunicorn.conf.py webapp:app
```

### Using Docker

1. **Create a Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy poetry files
COPY pyproject.toml poetry.lock ./

# Configure poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "src/webapp.py"]
```

2. **Build and run the Docker container:**
```bash
docker build -t pubmed-author-finder .
docker run -p 5000:5000 pubmed-author-finder
```

### Environment Variables

The following environment variables can be configured:

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Flask environment | `production` |
| `PORT` | Port to run the server on | `5000` |
| `WORKERS` | Number of Gunicorn workers | `4` |

### Reverse Proxy Setup (Nginx)

For production deployments, it's recommended to use a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
    }

    # Static files (if serving separately)
    location /static {
        alias /path/to/your/app/src/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Cloud Platform Deployment

### Heroku

1. **Create a `Procfile`:**
```
web: cd src && gunicorn webapp:app
```

2. **Create `runtime.txt`:**
```
python-3.11.4
```

3. **Deploy:**
```bash
heroku create your-app-name
git push heroku main
```

### Railway

1. **Add a `railway.toml`:**
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "cd src && poetry run gunicorn webapp:app --bind 0.0.0.0:$PORT"
```

### Google Cloud Run

1. **Create a `cloudbuild.yaml`:**
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/pubmed-author-finder', '.']
images:
  - 'gcr.io/$PROJECT_ID/pubmed-author-finder'
```

2. **Deploy:**
```bash
gcloud run deploy --image gcr.io/PROJECT_ID/pubmed-author-finder --platform managed
```

## Health Checks

The application provides a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```

Use this endpoint for:
- Load balancer health checks
- Monitoring systems
- Container orchestration health probes

## Performance Considerations

- **Timeout Settings:** PubMed API calls can take 30-60 seconds, ensure your deployment timeouts are set appropriately
- **Rate Limiting:** Consider implementing rate limiting to prevent abuse
- **Caching:** Implement caching for frequently searched terms
- **Monitoring:** Monitor API response times and error rates

## Security Considerations

- Use HTTPS in production
- Consider implementing authentication for internal use
- Validate and sanitize all user inputs
- Monitor for unusual usage patterns
- Keep dependencies updated

## Troubleshooting

### Common Issues

1. **Connection timeouts:** Increase server timeouts for PubMed API calls
2. **Memory usage:** Monitor memory consumption with multiple concurrent requests
3. **Rate limiting:** PubMed may rate limit requests; implement retry logic

### Logs

Check application logs for errors:
```bash
# Development
poetry run python webapp.py

# Production (Gunicorn)
gunicorn --log-level info webapp:app
```