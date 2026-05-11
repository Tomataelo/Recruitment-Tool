#!/bin/sh
set -e

echo "Setting up JWT keys..."
mkdir -p /app/config/jwt
printf '%s' "$JWT_SECRET_KEY_CONTENT" | base64 -d > /app/config/jwt/private.pem
printf '%s' "$JWT_PUBLIC_KEY_CONTENT" | base64 -d > /app/config/jwt/public.pem
chmod 600 /app/config/jwt/private.pem

echo "Clearing cache..."
php bin/console cache:clear

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Starting PHP-FPM..."
exec php-fpm
