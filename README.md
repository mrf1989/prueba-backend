# Muévete API

API REST para la aplicación web Muévete inspirada en la iniciativa solidaria
"Muévete por los que no pueden" y que se desarrolla como proyecto TFG.

## Requisitos para desarrollo y despliegue local

El entorno de desarrollo local debe contar con el siguiente software instalado.

- Deno v1.13.2
- MongoDB v5.0.6

```
git clone https://github.com/mrf1989/muevete-api.git
```

Se debe crear un archivo `.env` en el directorio raíz del proyecto y configurar
las variables de entorno requeridas:

- `PORT`: puerto que se utilizará en el despliegue local del entorno de
  desarrollo.
- `MONGODB_URI`: URI de conexión a la base de datos MongoDB que se utiliza.

Puede seguirse el ejemplo mostrado en `.env.example`.

### Ejecutar la aplicación

Es necesario tener configuradas las variables de entorno en `.env` y tener
activado el servicio de MongoDB.

La aplicación se ejecuta mediante el siguiente comando, desde el directorio raíz
del proyecto:

```
deno run -c ./tsconfig.json --allow-net --allow-env --allow-read --unstable ./src/app.ts
```

### Ejecutar los tests

Los tests del sistema se ejecutan a través desde el siguiente comando, desde el
directorio raíz del proyecto:

```
deno test -c ./tsconfig.json --allow-net --allow-env --allow-read --unstable
```
