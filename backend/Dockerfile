# Étape 1: Utiliser une image Node.js officielle comme image de base
FROM node:16-alpine AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source dans le conteneur
COPY . .

# Exposer le port 5000 pour accéder à l'application
EXPOSE 5000

# Démarrer l'application
CMD ["node", "server.js"]
