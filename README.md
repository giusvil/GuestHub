# GuestHub (React)

Frontend React per **GuestHub** — registro ospiti e invii Alloggiati Web / Ross1000.

Il portale **Blade** in Laravel (`/integrations/portal`) resta attivo e invariato. Questa app è un client alternativo che consuma le API JSON sotto `/api/portal/*`.

## Stack

- React 19 + TypeScript + Vite
- React Router
- Axios + Laravel Sanctum (cookie SPA)

## Sviluppo locale

### 1. Laravel API

```bash
cd ../LaravelDatalayer
cp .env.example .env   # se necessario
# Aggiungi in .env:
# FRONTEND_URL=http://localhost:5173
# CORS_ALLOWED_ORIGINS=http://localhost:5173
# SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,127.0.0.1:5173
# SESSION_DOMAIN=localhost

php artisan serve
```

### 2. React

```bash
cd ../GuestHub
cp .env.example .env
npm install
npm run dev
```

Apri http://localhost:5173 — Vite fa proxy di `/api` e `/sanctum` verso Laravel (:8000).

## API disponibili

| Metodo | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/portal/login` | guest |
| POST | `/api/portal/logout` | sanctum + portal.access |
| GET | `/api/portal/user` | sanctum + portal.access |
| GET | `/api/portal/dashboard` | sanctum + portal.access |
| POST | `/api/portal/submit` | sanctum + portal.submit |
| GET | `/api/portal/statistics` | sanctum + portal.statistics |
| GET | `/api/portal/receipts/alloggiati-web` | sanctum + portal.receipts |

Prima di ogni login: `GET /sanctum/csrf-cookie`.

## Produzione (Azure)

Opzioni senza nuovo App Service Plan:

1. **Static Web App / Blob + CDN** per `dist/` del React, `VITE_API_URL=https://laravel-datalayer.azurewebsites.net`
2. **Stessa Web App Laravel**: servire `dist/` da sottocartella (es. `/app`) — configurazione IIS/nginx

Impostare su Laravel:

- `FRONTEND_URL` = URL del frontend React
- `CORS_ALLOWED_ORIGINS` = stesso URL
- `SANCTUM_STATEFUL_DOMAINS` = dominio frontend (senza schema)

## Stato attuale

- Login, ricerca, invio, storico, ricevute: implementati
- Statistiche: dati API ok, UI ancora JSON grezzo (da portare dalla Blade)
