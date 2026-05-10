FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    bash \
    icu-dev \
    linux-headers \
    autoconf \
    g++ \
    make

RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    zip \
    opcache \
    intl \
    pcntl

RUN pecl install redis && docker-php-ext-enable redis

RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.validate_timestamps=1" >> /usr/local/etc/php/conf.d/opcache.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize

RUN mkdir -p var/cache var/log \
 && chmod -R 777 var/

EXPOSE 9000
