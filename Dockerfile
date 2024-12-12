# Stage 1
FROM node:alpine AS node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
# Copy application to work directoy
COPY . .
RUN npm run build

# Stage 2
FROM nginx:stable
COPY default.conf /etc/nginx/conf.d
COPY --from=node /app/dist/sensor-dashboard/browser /usr/share/nginx/html

EXPOSE 80