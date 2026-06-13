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
