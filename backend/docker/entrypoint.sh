#!/bin/sh
set -e

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Starting PHP-FPM..."
exec php-fpm
