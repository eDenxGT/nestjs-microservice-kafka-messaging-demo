# Stage 1: Build
FROM node:22-alpine3.21 as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm i

# Copy source code
COPY . .

# Build project
RUN npm run build

# Stage 2: Run
FROM node:22-alpine3.21
WORKDIR /app

COPY --from=build /app ./
CMD ["npm", "run", "start"]