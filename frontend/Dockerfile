FROM node:10-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod --extract-css=false


FROM nginx:alpine
COPY --from=build-step /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
