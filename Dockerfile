# build stage
FROM node:26-alpine3.23 AS builder

WORKDIR /app

COPY package.json ./
# da usare solo se esiste un package-lock.json
#RUN npm ci
RUN npm install

COPY . .
RUN npm run build
RUN npm prune --omit=dev

# runtime stage
FROM node:26-alpine3.23 AS runner

WORKDIR /app
ENV NODE_ENV=production

# istruzioni per copiare i moduli compilati
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package.json ./
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
#CMD ["node", "dist/index.js"]