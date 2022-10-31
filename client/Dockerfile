FROM public.ecr.aws/docker/library/node:lts-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 80

ENV PORT 80

CMD ["npm", "run", "dev"]