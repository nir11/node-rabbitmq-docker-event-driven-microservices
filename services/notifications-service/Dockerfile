# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY src ./src

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the application runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
