# Environment Variables Setup Guide

To use Google authentication with this application, you'll need to set up the following environment variables in a `.env.local` file in the project root:

```
# Google OAuth credentials (required for admin authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth configuration
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Comma-separated list of emails allowed to access the admin area
# Leave empty to allow all emails (for development only)
ALLOWED_ADMIN_EMAILS=example@gmail.com,another@gmail.com
```

## How to get Google OAuth credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Set up the authorized JavaScript origins (e.g., `http://localhost:3000`)
7. Set up the authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`)
8. Click "Create"
9. Copy the generated Client ID and Client Secret into your `.env.local` file

## NextAuth Secret

Generate a random secret for NextAuth by running:

```
openssl rand -base64 32
```

Use the generated string as your `NEXTAUTH_SECRET`.

## Allowed Admin Emails

For production, set `ALLOWED_ADMIN_EMAILS` to a comma-separated list of email addresses that should have access to the admin area. For development, you can leave this empty to allow any Gmail account to sign in. 