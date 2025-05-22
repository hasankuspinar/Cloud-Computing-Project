# Todo App Cloud Function

This directory contains serverless functions for processing Todo items in the cloud.

## Features

- HTTP Endpoint for processing Todo items
- Pub/Sub trigger for handling asynchronous Todo updates
- Basic validation and error handling
- Complexity calculation for Todo items
- Performance metrics tracking

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the function locally:
   ```
   npm run dev
   ```

3. Test with curl:
   ```
   curl -X POST http://localhost:8080 \
     -H "Content-Type: application/json" \
     -d '{"title": "Sample Todo", "description": "This is a test", "status": "pending"}'
   ```

## Deployment

### Docker Deployment

1. Build the Docker image:
   ```
   docker build -t todo-function .
   ```

2. Run the container:
   ```
   docker run -p 8080:8080 todo-function
   ```

3. For production deployment with Docker Compose, add to your docker-compose.yml:
   ```yaml
   todo-function:
     build: ./cloud-function
     ports:
       - "8080:8080"
     environment:
       - NODE_ENV=production
       - LOG_LEVEL=info
   ```

### Google Cloud Functions

1. Make sure you have the Google Cloud SDK installed and configured

2. Deploy the function:
   ```
   npm run deploy
   ```
   
   Or manually:
   ```
   gcloud functions deploy processTodoHttp \
     --runtime nodejs16 \
     --trigger-http \
     --allow-unauthenticated
   ```

3. For Pub/Sub deployment:
   ```
   gcloud functions deploy processTodoUpdate \
     --runtime nodejs16 \
     --trigger-topic todo-updates
   ```

### AWS Lambda (Alternative)

1. Package the function:
   ```
   zip -r function.zip index.js package.json node_modules
   ```

2. Create a Lambda function in the AWS console and upload the zip file

## Usage

### HTTP Endpoint

Send a POST request to the deployed function URL:

```
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample Todo", "description": "Task details", "status": "pending"}'
```

### Pub/Sub Integration

Publish a message to the `todo-updates` topic with a Todo item payload:

```json
{
  "title": "Sample Todo",
  "description": "Task details",
  "status": "completed"
}
```

## Environment Variables

The function can be configured with the following environment variables:

- `LOG_LEVEL`: Set the logging level (default: 'info')
- `FUNCTION_REGION`: The region where the function is deployed
- `PORT`: The port the function will listen on (default: 8080) 