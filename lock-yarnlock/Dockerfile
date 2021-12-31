FROM node:alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package* yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .

EXPOSE 3000
ENV PORT 3000

CMD ["node", "app.js"]
