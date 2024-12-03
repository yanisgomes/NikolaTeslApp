# Étape de construction avec Node.js
FROM node:18 AS build

WORKDIR /app
COPY . /app

RUN yarn install
RUN yarn build  # Cette commande construit l'application React

# Serveur HTTP avec nginx pour servir l'application React
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
