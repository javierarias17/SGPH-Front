# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/sakai-ng /usr/share/nginx/html
#Puerto accesible sólo dentron del contenedor, no desde afuera!
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]