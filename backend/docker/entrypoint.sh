#!/bin/sh
set -e

echo "Warming up cache..."
php bin/console cache:warmup

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Starting PHP-FPM..."
exec php-fpm
