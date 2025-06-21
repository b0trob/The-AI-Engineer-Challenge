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

### Debugging

If you're experiencing issues, visit `/debug` on your frontend deployment to run connectivity tests.

## Troubleshooting

### "Failed to fetch" Error

This error typically means the frontend can't reach the backend. Here's how to fix it:

1. **Check your API URL**: Make sure `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. **Verify API deployment**: Ensure your FastAPI backend is deployed and running
3. **Test API directly**: Try accessing your API health endpoint directly in the browser:
   ```
   https://your-api-project.vercel.app/api/health
   ```
4. **Check CORS**: The API should allow requests from your frontend domain

### Common Issues

#### Issue 1: Environment Variable Not Set
- **Symptom**: "Failed to fetch" errors
- **Solution**: Set `NEXT_PUBLIC_API_URL` in Vercel environment variables

#### Issue 2: API Not Deployed
- **Symptom**: API health check fails
- **Solution**: Deploy your FastAPI backend to Vercel

#### Issue 3: Wrong API URL
- **Symptom**: 404 errors or connection refused
- **Solution**: Double-check the API URL in your environment variables

#### Issue 4: CORS Issues
- **Symptom**: CORS errors in browser console
- **Solution**: The API is configured to allow all origins, but verify your frontend domain is accessible

### Step-by-Step Debugging

1. **Deploy both projects to Vercel**
2. **Set the environment variable** in your frontend project
3. **Visit `/debug`** on your frontend to test connectivity
4. **Check browser console** for detailed error messages
5. **Verify API endpoints** are working by testing them directly

### API Endpoints to Test

- Health check: `GET /api/health`
- API key test: `POST /api/test-key`
- Chat: `POST /api/chat`

### CORS Configuration

The FastAPI backend is configured to allow CORS from any origin. If you need to restrict this, update the CORS configuration in `api/app.py`. 