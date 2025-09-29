# Usar imagen oficial ligera de Node.js
FROM node:18-alpine

# Crear usuario no root para ejecutar la aplicación
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero para cachear
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar el resto del código fuente
COPY . .

# Cambiar propietario de los archivos al usuario nodejs
RUN chown -R nodejs:nodejs /app

# Cambiar al usuario no root
USER nodejs

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
