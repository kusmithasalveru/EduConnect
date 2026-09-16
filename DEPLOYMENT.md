# Deployment

Production architecture:

```
kusmithasalveru.in       ->  Vercel   (React/Vite static build, SPA rewrite in EduConnect_Frontend/vercel.json)
api.kusmithasalveru.in   ->  Render   (Spring Boot, Docker, EduConnect_Backend/Dockerfile, blueprint in render.yaml)
                              Neon    (PostgreSQL, free tier)
```

Pushing to `main` deploys both halves automatically (Vercel and Render watch the repo).
`.github/workflows/ci.yml` builds both halves on every push/PR so a broken build never reaches production.

## Environment variables

### Backend (Render → Environment)

| Variable | Value | Notes |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` | set by `render.yaml` / Dockerfile |
| `DB_URL` | `jdbc:postgresql://<neon-host>/<db>?sslmode=require` | from Neon connection details |
| `DB_USERNAME` | Neon role | |
| `DB_PASSWORD` | Neon password | |
| `JWT_SECRET` | `openssl rand -base64 48` | base64, ≥32 bytes decoded; never commit |
| `JWT_EXPIRATION_MS` | `86400000` | 24 h |
| `CORS_ALLOWED_ORIGINS` | `https://kusmithasalveru.in,https://www.kusmithasalveru.in` | comma-separated |
| `UPLOAD_DIR` | (optional) | defaults to `/app/uploads`; ephemeral on the free plan |
| `ALLOW_ADMIN_REGISTRATION` | (optional) | defaults to `false` in prod |

Without `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` or `CORS_ALLOWED_ORIGINS` the prod profile refuses to start.

### Frontend (Vercel → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://api.kusmithasalveru.in` |

`EduConnect_Frontend/.env.production` carries the same value as a fallback; Vercel's variable wins when set.

## DNS (GoDaddy → kusmithasalveru.in → DNS records)

| Type | Name | Value | Purpose |
|---|---|---|---|
| A | `@` | `76.76.21.21` | apex → Vercel |
| CNAME | `www` | `cname.vercel-dns.com` | www → Vercel |
| CNAME | `api` | `<service>.onrender.com` | API → Render (shown in Render → Settings → Custom Domains) |

Remove any GoDaddy "Parked" A record or forwarding rule for `@` first. Vercel and Render issue TLS certificates automatically once the records resolve.

## Local development

Nothing changes: `mvn spring-boot:run` uses the `dev` profile (`application-dev.yml`) with localhost defaults, and `npm run dev` uses `.env.development` (`http://localhost:8080`).

Run the production image locally:

```bash
docker build -t educonnect-backend EduConnect_Backend
docker run --rm -p 8080:8080 \
  -e DB_URL='jdbc:postgresql://host.docker.internal:5432/educonnect_backend' \
  -e DB_USERNAME=postgres -e DB_PASSWORD=postgres \
  -e JWT_SECRET="$(openssl rand -base64 48)" \
  -e CORS_ALLOWED_ORIGINS='http://localhost:5173' \
  educonnect-backend
```

## Known free-tier limits

- Render suspends the API after 15 min idle; first request afterwards takes 30–60 s. `.github/workflows/keep-alive.yml` pings `/health` every 14 min to avoid this.
- Uploaded profile images live on the container's disk and are lost on redeploy. A Render persistent disk (paid) or object storage fixes this if needed.
