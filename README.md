# GuestHub (React)

Frontend React per **GuestHub** — registro ospiti e invii Alloggiati Web / Ross1000.

Il portale **Blade** in Laravel (`/integrations/portal`) resta attivo e invariato. Questa app è un client alternativo che consuma le API JSON sotto `/api/portal/*`.

## Stack

- React 19 + TypeScript + Vite
- React Router
- Axios + Laravel Sanctum (Bearer token)

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

Il login restituisce un token Sanctum (`Authorization: Bearer …`) salvato in `sessionStorage` / `localStorage` (se "Ricordami").

## Produzione (Azure Static Web Apps)

| Risorsa | URL |
|---------|-----|
| **GuestHub (React)** | https://jolly-bush-0df126303.7.azurestaticapps.net |
| **Laravel API + Blade** | https://laravel-datalayer-aea9gdd6ghfrhkhw.italynorth-01.azurewebsites.net |

- Blade (classico): `…/integrations/portal`
- React: hostname Static Web App sopra

### Deploy automatico (GitHub Actions)

Il workflow `.github/workflows/azure-static-web-apps-guesthub.yml` parte su ogni **push su `main`**.

**Stato attuale:** il workflow è attivo ma fallisce finché manca il secret `AZURE_STATIC_WEB_APPS_API_TOKEN` nel repo GitHub (ultimi run: deploy step in errore).

**Configurazione una tantum** (dopo `gh auth login` e `az login`):

```bash
chmod +x scripts/setup-github-deploy-secret.sh
./scripts/setup-github-deploy-secret.sh
```

In alternativa manuale su GitHub → Settings → Secrets → Actions:

- Nome: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- Valore:
  ```bash
  az staticwebapp secrets list --name GuestHub --resource-group appbnb-v3 --query properties.apiKey -o tsv
  ```

### LaravelDatalayer

Il deploy automatico su App Service è **già attivo** (`scmType: GitHubAction`, workflow `main_laravel-datalayer.yml` su push `main`).

### Laravel (CORS + Sanctum cross-origin)

Su **laravel-datalayer** (App Service settings):

```env
FRONTEND_URL=https://jolly-bush-0df126303.7.azurestaticapps.net
CORS_ALLOWED_ORIGINS=https://jolly-bush-0df126303.7.azurestaticapps.net
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
```

`SESSION_DOMAIN` lasciare vuoto (cookie sulla API Laravel).

## Stato attuale

- Login, ricerca, invio, storico, ricevute: implementati
- Statistiche: dati API ok, UI ancora JSON grezzo (da portare dalla Blade)
