import Elysia, { t } from 'elysia'
import { createResponse } from '../common/model'
import { ResponseStatus } from '../common/enum'

const register = t.Object(
  {
    username: t.String({
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$',
      error:
        'Nama pengguna harus terdiri dari 3-20 karakter dan hanya boleh berisi huruf, angka, atau underscore.',
    }),

    password: t.String({
      minLength: 6,
      maxLength: 20,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$',
      error:
        'Kata sandi harus terdiri dari 6-20 karakter dan mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu simbol.',
    }),
  },
  {
    error: 'Request body harus berupa objek',
  },
)

const login = t.Object(
  {
    username: t.String({
      minLength: 1,
      error: 'Nama pengguna harus berupa string dan tidak boleh kosong',
    }),

    password: t.String({
      minLength: 1,
      error: 'Kata sandi harus berupa string dan tidak boleh kosong',
    }),
  },
  {
    error: 'Request body harus berupa objek',
  },
)

const refresh = t.Object(
  {
    refreshToken: t.String({
      minLength: 1,
      error: 'Refresh token harus berupa string dan tidak boleh kosong',
    }),
  },
  {
    error: 'Request body harus berupa objek',
  },
)

const loginSuccess = t.Composite([
  createResponse(ResponseStatus.SUCCESS),
  t.Object({
    data: t.Object({
      id: t.String({ format: 'uuid' }),
      username: t.String(),
      accessToken: t.String(),
      refreshToken: t.String(),
    }),
  }),
])

const authModel = new Elysia().model({
  register: register,
  login: login,
  loginSuccess: loginSuccess,
  refresh: refresh,
})

export { authModel }
