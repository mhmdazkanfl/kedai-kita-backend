import dotenv from 'dotenv'
import swagger from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { auth } from './auth'

dotenv.config({ path: '../../.env.local' })

const app = new Elysia()
  .use(swagger())
  .use(auth)
  .get(
    '/health',
    () => `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  )
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
