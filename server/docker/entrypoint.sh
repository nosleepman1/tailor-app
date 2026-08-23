#!/bin/bash
set -e

echo "🚀 [TailleurPro] Initialisation du conteneur..."

# Set default supervisor environment variables if not defined
export ENABLE_QUEUE_WORKER=${ENABLE_QUEUE_WORKER:-true}
export ENABLE_SCHEDULER=${ENABLE_SCHEDULER:-true}
export QUEUE_WORKER_PROCS=${QUEUE_WORKER_PROCS:-2}

# Wait for PostgreSQL Database readiness if DB_HOST is defined
if [ -n "$DB_HOST" ] && [ "$DB_CONNECTION" = "pgsql" ]; then
    echo "⏳ [TailleurPro] Attente de la base de données ($DB_HOST:${DB_PORT:-5432})..."
    max_tries=30
    counter=0
    until nc -z -w 2 "$DB_HOST" "${DB_PORT:-5432}" >/dev/null 2>&1; do
        counter=$((counter + 1))
        if [ $counter -gt $max_tries ]; then
            echo "❌ [TailleurPro] Erreur: Impossible de joindre la base de données après ${max_tries}s."
            break
        fi
        sleep 1
    done
    echo "✅ [TailleurPro] Base de données disponible !"
fi

# Wait for Redis readiness if REDIS_HOST is defined
if [ -n "$REDIS_HOST" ]; then
    echo "⏳ [TailleurPro] Attente de Redis ($REDIS_HOST:${REDIS_PORT:-6379})..."
    max_tries=15
    counter=0
    until nc -z -w 2 "$REDIS_HOST" "${REDIS_PORT:-6379}" >/dev/null 2>&1; do
        counter=$((counter + 1))
        if [ $counter -gt $max_tries ]; then
            echo "⚠️ [TailleurPro] Avertissement: Redis non disponible après ${max_tries}s."
            break
        fi
        sleep 1
    done
    echo "✅ [TailleurPro] Redis disponible !"
fi

# Ensure storage symlink exists
php artisan storage:link --quiet || true

# Execute migrations if enabled
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "📦 [TailleurPro] Exécution des migrations..."
    php artisan migrate --force --no-interaction
fi

# Execute seeders if explicitly requested
if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    echo "🌱 [TailleurPro] Exécution des seeders..."
    php artisan db:seed --force --no-interaction
fi

# Production Cache Optimizations
if [ "${APP_ENV}" = "production" ] || [ "${OPTIMIZE_CACHE:-true}" = "true" ]; then
    echo "⚡ [TailleurPro] Optimisation des caches de production..."
    php artisan optimize:clear --quiet
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Ensure correct file permissions on storage and bootstrap
chown -R laravel:laravel /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache || true

echo "✅ [TailleurPro] Prêt — Démarrage des processus (PHP-FPM, Nginx, Queues, Scheduler)..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
