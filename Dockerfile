# Используем официальный образ Node.js версии LTS
FROM node:lts AS build-stage

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и yarn.lock (или npm-пакеты) для кеширования зависимостей
COPY package*.json yarn.lock* ./
RUN yarn install || npm ci

# Копируем остальные файлы приложения
COPY . .

# Запускаем сборку production-версии проекта
RUN yarn run build || npm run build

# Финальный этап сборки для продакшена
FROM nginx:alpine

# Копируем собранные статичные файлы в контейнер Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Открываем порт 80 для HTTP-трафика
EXPOSE 80

# Настройка Nginx (необязательно, если хотите кастомизировать конфиг)
# COPY ./nginx.conf /etc/nginx/nginx.conf

# Запускаем сервер Nginx
CMD ["nginx", "-g", "daemon off;"]