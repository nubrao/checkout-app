# Use Node 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3001

# Update the start command to use standalone server
CMD ["node", ".next/standalone/server.js", "--host", "0.0.0.0", "--port", "3001"]
