# ─────────────────────────────────────────────
# Stage 1 — Dépendances Composer
# ─────────────────────────────────────────────
FROM composer:2.7 AS composer

WORKDIR /app

COPY server/composer.json server/composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-reqs

# ─────────────────────────────────────────────
# Stage 2 — Image finale PHP 8.3-FPM + Nginx
# ─────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS app

ENV APP_ENV=staging \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

# --- Dépendances système ---------------------
RUN apk add --no-cache \
    bash \
    curl \
    nginx \
    supervisor \
    icu-libs \
    libzip \
    oniguruma \
    libpq \
    && apk add --no-cache --virtual .build-deps \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    libpq-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-install -j$(nproc) \
    bcmath \
    ctype \
    fileinfo \
    intl \
    mbstring \
    opcache \
    pcntl \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    tokenizer \
    xml \
    zip \
    && apk del .build-deps \
    && rm -rf /tmp/*

# --- Configs PHP, FPM, Nginx, Supervisor -----
COPY server/docker/php/php.ini       /usr/local/etc/php/conf.d/99-app.ini
COPY server/docker/php/opcache.ini   /usr/local/etc/php/conf.d/99-opcache.ini
COPY server/docker/php/php-fpm.conf  /usr/local/etc/php-fpm.d/zz-app.conf
COPY server/docker/nginx/nginx.conf  /etc/nginx/nginx.conf
COPY server/docker/nginx/api.conf    /etc/nginx/http.d/default.conf
COPY server/docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# --- Utilisateur non-root --------------------
RUN addgroup -g 1001 -S laravel \
    && adduser -u 1001 -S laravel -G laravel

# --- Code source -----------------------------
WORKDIR /var/www/html

COPY --chown=laravel:laravel server/ .

COPY --from=composer --chown=laravel:laravel /app/vendor ./vendor

# --- Permissions & caches Laravel ------------
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R laravel:laravel storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan event:cache

EXPOSE 8080

COPY --chown=root:root server/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/up || exit 1

ENTRYPOINT ["/entrypoint.sh"]