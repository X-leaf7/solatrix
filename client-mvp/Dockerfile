FROM public.ecr.aws/docker/library/node:lts-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock ./
RUN npm install --force

COPY . .

ARG domain
ENV NEXT_PUBLIC_SOCKET_SERVER_URL="https://chat.${domain}"
ENV NEXT_PUBLIC_BACKEND_API_URL="http://localhost:8001${domain}"

RUN npm run build

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]