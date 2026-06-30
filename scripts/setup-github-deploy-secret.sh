#!/usr/bin/env bash
# Configura il secret GitHub per il deploy automatico di GuestHub su Azure Static Web Apps.
# Prerequisiti: az login, gh auth login (oppure GITHUB_PAT con permesso repo + secrets)

set -euo pipefail

REPO="${GUESTHUB_REPO:-giusvil/GuestHub}"
SECRET_NAME="AZURE_STATIC_WEB_APPS_API_TOKEN"
SWA_NAME="${SWA_NAME:-GuestHub}"
RESOURCE_GROUP="${RESOURCE_GROUP:-appbnb-v3}"
WORKFLOW_NAME="Deploy GuestHub to Azure Static Web Apps"

if [[ -n "${GITHUB_PAT:-}" ]]; then
  export GH_TOKEN="$GITHUB_PAT"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Errore: installa GitHub CLI (https://cli.github.com/)." >&2
  exit 1
fi

if ! command -v az >/dev/null 2>&1; then
  echo "Errore: installa Azure CLI (https://learn.microsoft.com/cli/azure/)." >&2
  exit 1
fi

gh auth status >/dev/null

echo "Recupero deployment token da Azure Static Web App '${SWA_NAME}'..."
DEPLOY_TOKEN="$(az staticwebapp secrets list \
  --name "$SWA_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query properties.apiKey \
  -o tsv | tr -d '\r\n')"

if [[ -z "$DEPLOY_TOKEN" ]]; then
  echo "Errore: token di deploy non trovato." >&2
  exit 1
fi

echo "Aggiorno secret GitHub '${SECRET_NAME}' su ${REPO}..."
echo "$DEPLOY_TOKEN" | gh secret set "$SECRET_NAME" --repo "$REPO"

echo "Avvio workflow di deploy..."
gh workflow run "$WORKFLOW_NAME" --repo "$REPO" --ref main

echo ""
echo "Fatto. Controlla lo stato:"
echo "  gh run list --repo ${REPO} --workflow azure-static-web-apps-guesthub.yml"
