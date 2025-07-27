# Environment Variables Setup Guide

To use Google SSO authentication with this application, you'll need to set up the following environment variables in a `.env.local` file in the project root:

```
# Google OAuth credentials (required for admin authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth configuration
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
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

## Authentication Flow

This application uses Google SSO for admin authentication. Only authorized email addresses can access the admin dashboard. The allowed email addresses are configured in the `auth.ts` file in the project root.

Currently, only the following email address has admin access:
- `tpfitz42@gmail.com`

To add more authorized emails, edit the `ALLOWED_ADMIN_EMAILS` array in `auth.ts`.

## Security Notes

- Only Gmail accounts are allowed to sign in
- Only email addresses in the `ALLOWED_ADMIN_EMAILS` array can access admin functionality
- All admin API routes are protected with authentication checks
- Unauthenticated users are redirected to `/signin` when trying to access admin routes 