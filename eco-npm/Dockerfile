FROM node:alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package* ./
RUN npm install --frozen-lockfile 
# --production --ignore-scripts --prefer-offline

COPY . .

RUN npm run build

EXPOSE 3000
ENV PORT 3000

CMD ["node", "build/index.js"]
