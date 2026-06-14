#!/bin/bash
set -e

echo "🚀 Démarrage de l'application Laravel..."

# Migrations automatiques (optionnel en pré-prod)
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "📦 Exécution des migrations..."
    php artisan migrate --force --no-interaction
fi

# Lien symbolique storage
php artisan storage:link --quiet || true

# Vidage des caches si nécessaire (utile pour le premier boot)
if [ "${CLEAR_CACHE:-false}" = "true" ]; then
    echo "🧹 Vidage des caches..."
    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

echo "✅ Prêt — lancement de Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
