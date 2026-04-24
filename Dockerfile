FROM node:25-alpine3.22 AS build

WORKDIR /app/viceVersa

COPY viceVersa/package*.json ./

RUN npm install

RUN npx

COPY viceVersa/ ./

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/viceVersa/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]