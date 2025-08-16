import { Elysia } from 'elysia';

const app = new Elysia()
  .get(
    '/health',
    () => `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
