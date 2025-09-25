# Étape 1 : build
FROM node:18-alpine AS build
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste du projet
COPY . .

# Build de l'application en mode production
RUN npm run build

# Étape 2 : image runtime
FROM nginx:alpine
# Supprimer la config par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers build de Vue vers le dossier de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier config Nginx custom (optionnel, si tu veux gérer le fallback pour Vue Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
