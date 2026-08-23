# ─────────────────────────────────────────────────────────────
# TailleurPro — Production Dockerfile (PHP 8.3 FPM + Nginx + Supervisor)
# Multi-stage optimized build
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Build Dependencies via Composer ─────────────────
FROM composer:2.7 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-reqs

# ── Stage 2: Final Production Runtime Image ──────────────────
FROM php:8.3-fpm-alpine AS app

LABEL maintainer="TailleurPro Team <support@tailleurpro.com>"
LABEL description="TailleurPro Laravel 12 Production Container"

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

# Install system runtime dependencies & build packages
RUN apk add --no-cache \
    bash \
    curl \
    nginx \
    supervisor \
    netcat-openbsd \
    icu-libs \
    libzip \
    libpng \
    libjpeg-turbo \
    freetype \
    libwebp \
    oniguruma \
    libpq \
    && apk add --no-cache --virtual .build-deps \
    icu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libwebp-dev \
    oniguruma-dev \
    libpq-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
    bcmath \
    ctype \
    exif \
    fileinfo \
    gd \
    intl \
    mbstring \
    opcache \
    pcntl \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    xml \
    zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps \
    && rm -rf /tmp/* /var/cache/apk/*

# Copy configuration files
COPY docker/php/php.ini       /usr/local/etc/php/conf.d/99-app.ini
COPY docker/php/opcache.ini   /usr/local/etc/php/conf.d/99-opcache.ini
COPY docker/php/php-fpm.conf  /usr/local/etc/php-fpm.d/zz-app.conf
COPY docker/nginx/nginx.conf  /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Setup non-root application user
RUN addgroup -g 1001 -S laravel \
    && adduser -u 1001 -S laravel -G laravel

WORKDIR /var/www/html

# Copy source code and vendor dependencies
COPY --chown=laravel:laravel . .
COPY --from=vendor --chown=laravel:laravel /app/vendor ./vendor

# Setup directories, caches and file permissions
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    /var/run \
    /run \
    && chown -R laravel:laravel storage bootstrap/cache /var/run /run /var/lib/nginx \
    && chmod -R 775 storage bootstrap/cache

# Copy and setup entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/up || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]