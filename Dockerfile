FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm rebuild better-sqlite3 && npm run build:node && npm prune --omit=dev --ignore-scripts

FROM node:22-bookworm-slim
ENV NODE_ENV=production HOST=0.0.0.0 DATABASE_PATH=/data/vision.db
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY scripts ./scripts
EXPOSE 3000
CMD ["node", "build"]
