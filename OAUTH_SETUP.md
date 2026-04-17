# Google OAuth Local Setup

This project already supports Google sign-in in the backend and frontend. To run it locally, add the following environment variables before starting the apps.

## Backend

Set these values in your local shell, IDE run configuration, or a local `.env` file if your workflow loads one:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `APP_OAUTH_FRONTEND_URL=http://localhost:3000`

The backend reads `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `APP_OAUTH_FRONTEND_URL` from the environment.

## Frontend

Create a local `.env` file in `smart-campus-client` with:

```env
VITE_API_URL=http://localhost:8080
```

## Google Cloud Console

In your Google OAuth client settings, add this authorized redirect URI:

```text
http://localhost:8080/login/oauth2/code/google
```

Also make sure the origin for your app matches the frontend URL you use locally, usually:

```text
http://localhost:5173
```

## Start Order

1. Start the backend after setting the Google OAuth environment variables.
2. Start the frontend with `VITE_API_URL` pointing at the backend.
3. Use the `Continue with Google` button on the home page.

## Expected Flow

- Google authenticates the user.
- Spring Security completes the OAuth callback.
- The backend creates or reuses a local account record.
- The app redirects back to the frontend session flow.
