# MedVerify

## Security Configuration

Backend APIs for alerts, dashboard stats, reports, and routing require a bearer
token from `/auth/login` or OTP verification. Frontend protected routes also
validate the saved token through `/auth/me`.

## Redis Requirement

Redis is required for backend startup because auth sessions, alerts, routing,
and reports use shared Redis state. If Redis is unavailable, the backend fails
fast instead of falling back to per-process memory.

Start Redis before launching the backend:

```powershell
docker compose up -d redis
```

If Docker is not available and you installed the Windows Redis fork:

```powershell
Start-Process -FilePath "C:\Users\shrut\AppData\Local\Microsoft\WinGet\Packages\taizod1024.redis-windows-fork_Microsoft.Winget.Source_8wekyb3d8bbwe\Redis-8.8.0-Windows-x64-msys2\redis-server.exe" -ArgumentList '--port','6379','--dir','C:\Users\shrut\OneDrive\Documents\GitHub\MedVerify\.redis-data','--appendonly','yes' -WindowStyle Hidden
```

Use the in-memory fake store only for isolated local tests:

```env
ALLOW_IN_MEMORY_STORE=true
```

Admin access is limited to a maximum of six configured email addresses. Admin
accounts are provisioned from environment configuration so credentials are not
recoverable from source or frontend build artifacts. Configure them in `.env`:

```env
ADMIN_ALLOWED_EMAILS=admin1@hospital.com,admin2@hospital.com,admin3@hospital.com,admin4@hospital.com,admin5@hospital.com,admin6@hospital.com
ADMIN_BOOTSTRAP_USERS=[{"email":"admin1@hospital.com","password":"change-this-password","name":"Admin One"}]
```

Only emails listed in `ADMIN_ALLOWED_EMAILS` and provisioned through
`ADMIN_BOOTSTRAP_USERS` can authenticate as admin. If more than six emails are
configured, admin authentication is rejected. Updating `ADMIN_BOOTSTRAP_USERS`
rotates the stored admin password on the next admin login attempt.

WhatsApp webhooks verify `X-Twilio-Signature` by default. Set these values in
`.env` before exposing `/webhook/whatsapp`:

```env
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WEBHOOK_PUBLIC_URL=https://your-public-domain/webhook/whatsapp
TWILIO_VALIDATE_WEBHOOK_SIGNATURE=true
```

For local unsigned webhook testing only:

```env
ALLOW_UNSIGNED_TWILIO_WEBHOOK=true
```

## Production Deployment

Vercel should host only the React frontend in `healthcare-ai-ui`. The FastAPI
backend needs a separate host with Redis. This repo includes:

- `vercel.json` for the Vercel frontend build.
- `backend/Dockerfile` for the FastAPI backend.
- `render.yaml` for a Render backend plus Redis blueprint.

### 1. Deploy Backend On Render

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from this repo.
3. Render will create:
   - `medverify-backend`
   - `medverify-redis`
4. Set these Render environment variables on `medverify-backend`:

```env
ADMIN_ALLOWED_EMAILS=admin1@example.com,admin2@example.com
ADMIN_BOOTSTRAP_USERS=[{"email":"admin1@example.com","password":"strong-password","name":"Admin One"}]
TWILIO_VALIDATE_WEBHOOK_SIGNATURE=true
```

Render injects `REDIS_URL` from the Redis service automatically through
`render.yaml`.

### 2. Connect Vercel Frontend To Backend

In Vercel project settings, add:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

Redeploy Vercel after setting this variable. If it is not set, production builds
use the default Render blueprint URL:

```env
https://medverify-backend.onrender.com
```

Use the Vercel setting whenever your Render service URL is different.
