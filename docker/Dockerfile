FROM denoland/deno:1.13.2

EXPOSE 8080

WORKDIR /app

RUN apt-get update
RUN apt-get install -y git
RUN git clone https://github.com/mrf1989/muevete-api.git

WORKDIR /app/muevete-api

RUN echo PORT=8080 > .env
RUN echo MONGODB_URI=mongodb://mongo:27017 >> .env
RUN deno cache --unstable ./deps.ts

CMD ["run", "--config", "./tsconfig.json", "--allow-net", "--allow-env", "--allow-read", "--unstable", "./src/app.ts"]