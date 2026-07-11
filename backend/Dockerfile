FROM php:8.4.7-fpm

# Instala dependências do sistema e extensões PHP necessárias pro Laravel + MySQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    && docker-php-ext-install pdo pdo_mysql zip gd

# Instala o Composer dentro da imagem
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-interaction --optimize-autoloader

RUN cp .env.example .env
RUN php artisan key:generate --force

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000