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

## Produzione (Azure Static Web Apps)

| Risorsa | URL |
|---------|-----|
| **GuestHub (React)** | https://jolly-bush-0df126303.7.azurestaticapps.net |
| **Laravel API + Blade** | https://laravel-datalayer-aea9gdd6ghfrhkhw.italynorth-01.azurewebsites.net |

- Blade (classico): `…/integrations/portal`
- React: hostname Static Web App sopra

### Deploy automatico (GitHub Actions)

1. Aggiungi il secret nel repo **GuestHub** su GitHub:
   - Nome: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Valore: token da Azure Portal → GuestHub → **Manage deployment token**, oppure:
     ```bash
     az staticwebapp secrets list --name GuestHub --resource-group appbnb-v3 --query properties.apiKey -o tsv
     ```
2. Push su `main` → workflow `.github/workflows/azure-static-web-apps-guesthub.yml`

### Laravel (CORS + Sanctum cross-origin)

Su **laravel-datalayer** (App Service settings):

```env
FRONTEND_URL=https://jolly-bush-0df126303.7.azurestaticapps.net
CORS_ALLOWED_ORIGINS=https://jolly-bush-0df126303.7.azurestaticapps.net
SANCTUM_STATEFUL_DOMAINS=jolly-bush-0df126303.7.azurestaticapps.net
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
```

`SESSION_DOMAIN` lasciare vuoto (cookie sulla API Laravel).

## Stato attuale

- Login, ricerca, invio, storico, ricevute: implementati
- Statistiche: dati API ok, UI ancora JSON grezzo (da portare dalla Blade)
