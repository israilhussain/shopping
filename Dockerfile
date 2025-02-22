# Use an official Node.js image for building the React app
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files to the container
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx image to serve the React app
FROM nginx:alpine

# Copy the built React files to Nginx's default directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for serving the application
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
