FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


#  docker compose -f docker-compose.dev.yml up --build -d
#  docker compose -f docker-compose.prod.yml up --build -d
#  docker compose -f docker-compose.prod.yml down --rmi all