FROM node:20 AS build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build


FROM nginx:stable-alpine
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/certs/localhost-cert.pem /etc/nginx/certs/localhost-cert.pem
COPY nginx/certs/localhost-key.pem /etc/nginx/certs/localhost-key.pem
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]