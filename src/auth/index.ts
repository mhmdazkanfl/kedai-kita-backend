import { Elysia, t } from 'elysia';

export const auth = new Elysia({ prefix: '/auth' }).post(
  '/register',
  async () => 'aaa',
);
