# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (use ci for reproducible installs)
COPY package*.json ./
RUN npm ci

# Build args injected at build time
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_RAZORPAY_KEY_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID

COPY . .
RUN npm run build

# ---- Production stage: nginx ----
FROM nginx:1.27-alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config: SPA routing rewrite + gzip + security headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
