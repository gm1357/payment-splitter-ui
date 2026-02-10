# Stage 1: Build
FROM node:22-slim AS build

RUN apt-get update && apt-get install -y git openssl && rm -rf /var/lib/apt/lists/*

ARG API_REF=main
RUN git clone --depth 1 --branch ${API_REF} https://github.com/gm1357/payment-splitter-api.git /app

WORKDIR /app

RUN yarn install --frozen-lockfile
RUN npx prisma generate
RUN yarn build

# Stage 2: Production
FROM node:22-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/package.json /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma

RUN yarn add prisma@^6 --production

COPY docker/api-entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
