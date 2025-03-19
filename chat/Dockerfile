FROM public.ecr.aws/docker/library/node:lts-alpine

WORKDIR /app

COPY package* ./

RUN npm ci

COPY . /app

EXPOSE 3000
CMD npm start