require('dotenv').config({ path: './.env.local' })

import swagger from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        tags: [
          { name: 'Auth', description: 'Authentication related endpoints' },
        ],
        info: {
          title: 'Kedai Kita API',
          version: '1.0.0',
        },
        // Define the security scheme here
        components: {
          securitySchemes: {
            bearerAuth: {
              // You can name this whatever you like
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    }),
  )
  .use(auth)
  .get('/ping', () => 'PONG!')
  .listen(3000, ({ port, hostname }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`)
  })
