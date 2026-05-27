FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
