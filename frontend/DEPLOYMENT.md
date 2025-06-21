# Deployment Guide

## Frontend Deployment Configuration

### Environment Variables

To deploy the frontend to Vercel, you need to set the following environment variable:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variable:

```
NEXT_PUBLIC_API_URL=https://your-api-project.vercel.app
```

Replace `https://your-api-project.vercel.app` with the actual URL of your FastAPI backend deployment.

### Local Development

For local development, create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=
```

Leave it empty to use relative paths for local development.

### API Deployment

Make sure your FastAPI backend is deployed to Vercel and accessible at the URL you specified in `NEXT_PUBLIC_API_URL`.

### Troubleshooting

If you're getting "Sorry, there was an error processing your request" errors:

1. Check that your API URL is correct in the environment variables
2. Verify that your FastAPI backend is running and accessible
3. Check the browser's developer console for any CORS errors
4. Ensure your API key is valid and has the correct format

### CORS Configuration

The FastAPI backend is configured to allow CORS from any origin. If you need to restrict this, update the CORS configuration in `api/app.py`. 