# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Empty = same-origin: the browser calls /api/... and Nginx routes it to the right service.
ARG VITE_AUTH_SERVICE_URL=""
ARG VITE_PRODUCT_SERVICE_URL=""
ARG VITE_PAYMENT_SERVICE_URL=""
ARG VITE_CART_SERVICE_URL=""
ARG VITE_ORDER_SERVICE_URL=""
ENV VITE_AUTH_SERVICE_URL=$VITE_AUTH_SERVICE_URL \
    VITE_PRODUCT_SERVICE_URL=$VITE_PRODUCT_SERVICE_URL \
    VITE_PAYMENT_SERVICE_URL=$VITE_PAYMENT_SERVICE_URL \
    VITE_CART_SERVICE_URL=$VITE_CART_SERVICE_URL \
    VITE_ORDER_SERVICE_URL=$VITE_ORDER_SERVICE_URL
RUN npm run build

# ---- serve stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/nginx-health || exit 1
