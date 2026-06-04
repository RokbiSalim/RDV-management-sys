# --- STAGE 1: Build the React Application ---
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files first (helps with Docker caching)
COPY package*.json ./

# Install ALL dependencies (including Vite & its plugins in devDependencies)
RUN npm install

# Copy the rest of your React app's source code
COPY . .

# Build the project (generates the 'dist' folder using Vite)
RUN npm run build

# --- STAGE 2: Serve the application with Nginx ---
FROM nginx:alpine

# Copy the static build files from Stage 1 to Nginx's default public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 inside the container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]