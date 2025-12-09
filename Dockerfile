# Dockerfile (put at backend root)
FROM node:22

# Install build tools
RUN apt-get update && apt-get install -y build-essential make flex bison

WORKDIR /app

# Copy everything
COPY . .

# Build the compiler using the provided Makefile
RUN if [ -f prototype-0/makefile ] || [ -f prototype-0/Makefile ]; then \
      cd prototype-0 && make; \
    else \
      echo "No makefile found in prototype-0 - skipping make"; \
    fi

# Make sure built binaries are executable (if make produced them)
RUN if [ -f prototype-0/compiler ]; then chmod +x prototype-0/compiler || true; fi

# Install Node.js dependencies
RUN npm ci --only=production || npm install --only=production

EXPOSE 3001

CMD ["node", "server.js"]
