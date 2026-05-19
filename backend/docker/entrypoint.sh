#!/bin/sh
set -e

if [ -n "$JWT_SECRET_KEY_CONTENT" ]; then
    echo "Setting up JWT keys from env..."
    mkdir -p /app/config/jwt
    printf '%s' "$JWT_SECRET_KEY_CONTENT" | base64 -d > /app/config/jwt/private.pem
    printf '%s' "$JWT_PUBLIC_KEY_CONTENT" | base64 -d > /app/config/jwt/public.pem
    chmod 644 /app/config/jwt/private.pem
    chmod 644 /app/config/jwt/public.pem
    chown www-data:www-data /app/config/jwt/private.pem
    chown www-data:www-data /app/config/jwt/public.pem
fi

echo "Clearing cache..."
php bin/console cache:clear

echo "Setting var/ permissions..."
chown -R www-data:www-data /app/var/

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

exec "${@:-php-fpm}"
