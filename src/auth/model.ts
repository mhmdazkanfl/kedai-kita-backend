import Elysia, { t } from 'elysia'
import { Status } from '@/common/enum'

export const authModel = new Elysia({ name: 'model/auth' }).model({
  registerBody: t.Object({
    username: t.String({
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$',
      error:
        'Username harus terdiri dari 3-20 karakter dan hanya boleh berisi huruf, angka, atau underscore.',
    }),

    password: t.String({
      minLength: 6,
      maxLength: 20,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$',
      error:
        'Kata sandi harus terdiri dari 6-20 karakter dan mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu simbol.',
    }),
  }),

  registerResponse: t.Object({
    status: t.UnionEnum([Status.SUCCESS, Status.FAIL, Status.ERROR]),
    message: t.String(),
    data: t.Object({
      id: t.String({ format: 'uuid' }),
      username: t.String(),
    }),
  }),
})
