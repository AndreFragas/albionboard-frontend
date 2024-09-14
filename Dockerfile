FROM node:21.6.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:21.6.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 3019
ENV TZ=America/Sao_Paulo
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["npm", "start"]
