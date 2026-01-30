# Environment Setup Guide

This project uses environment variables to manage different configurations for development and production environments.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   - Get your Supabase URL and anon key from: https://app.supabase.com/project/_/settings/api

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Files

### `.env.local` (Development - Gitignored)
- Used for local development
- Contains your personal Supabase credentials
- **Never commit this file**

### `.env.example` (Template)
- Template file showing required environment variables
- Safe to commit to version control
- Copy this to `.env.local` and fill in your values

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `development` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

## Production Deployment

### Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your production Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your production Supabase anon key
   - `NODE_ENV` - Set to `production`

### Other Platforms

Set the environment variables in your hosting platform's dashboard or configuration file.

## Development vs Production

### Development
- Uses `.env.local` file
- Runs on `http://localhost:3000`
- Connects to development Supabase project
- Hot reload enabled

### Production
- Uses environment variables from hosting platform
- Custom domain or platform URL
- Connects to production Supabase project
- Optimized builds

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is required" error
- Make sure `.env.local` exists and contains `NEXT_PUBLIC_SUPABASE_URL`
- Restart your development server after creating/modifying `.env.local`

### Environment variables not updating
- Restart your development server
- Clear Next.js cache: `rm -rf .next`
- Make sure variable names start with `NEXT_PUBLIC_` for client-side access

## Security Notes

- Never commit `.env.local` or any file containing real credentials
- Use different Supabase projects for development and production
- Rotate keys if they are accidentally committed
- Use environment variables in CI/CD pipelines, not hardcoded values

