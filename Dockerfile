FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Verify Bun installation
RUN bun --version

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose ports
EXPOSE 8080 8080

CMD ["bun", "run", "server"]
