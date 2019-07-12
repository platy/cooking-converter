FROM node:10.16-alpine AS build
WORKDIR /build

# install dependencies
COPY package.json package-lock.json ./
RUN npm install

# build
COPY . .
RUN npm test
RUN npm run build

# pack deployment container
FROM nginx:1.17-alpine

EXPOSE 80
COPY --from=build /build/dist /usr/share/nginx/html
