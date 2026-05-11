#!/bin/sh
set -e

echo "Setting up JWT keys..."
mkdir -p config/jwt
echo "$JWT_SECRET_KEY_CONTENT" | base64 -d > config/jwt/private.pem
echo "$JWT_PUBLIC_KEY_CONTENT" | base64 -d > config/jwt/public.pem
chmod 600 config/jwt/private.pem

echo "Clearing cache..."
php bin/console cache:clear

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Starting PHP-FPM..."
exec php-fpm
