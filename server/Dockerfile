# Use official Node.js LTS image
FROM node:18

# Set working dir inside container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose app port
EXPOSE 3000

# Start server
CMD ["node", "index.js"]
