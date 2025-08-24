import Elysia, { t } from 'elysia'

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

const token = t.Cookie(
  {
    refresh_token: t.Optional(t.String()),
    access_token: t.String({ error: 'Tidak terotorisasi' }),
  },
  {
    error: 'Cookie harus berupa objek',
    secrets: process.env.COOKIE_SECRET!,
  },
)

const tokenOptional = t.Cookie(
  {
    refresh_token: t.Optional(t.String()),
    access_token: t.Optional(t.String()),
  },
  {
    secrets: process.env.COOKIE_SECRET!,
  },
)

const authModel = new Elysia({ name: 'auth/model' }).model({
  register: register,
  login: login,
  token: token,
  tokenOptional: tokenOptional,
})

export default authModel
// export const authModel = new Elysia({ name: 'auth/model' }).model({
//   register: t.Object({
//     username: t.String({
//       minLength: 3,
//       maxLength: 20,
//       pattern: '^[a-zA-Z0-9_]+$',
//       error:
//         'Nama pengguna harus terdiri dari 3-20 karakter dan hanya boleh berisi huruf, angka, atau underscore.',
//     }),

//     password: t.String({
//       minLength: 6,
//       maxLength: 20,
//       pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$',
//       error:
//         'Kata sandi harus terdiri dari 6-20 karakter dan mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu simbol.',
//     }),
//   }),

//   registerResponse: t.Object({
//     status: t.UnionEnum([Status.SUCCESS, Status.FAIL, Status.ERROR]),
//     message: t.String(),
//     data: t.Object({
//       id: t.String({ format: 'uuid' }),
//       username: t.String(),
//     }),
//   }),

//   loginBody: t.Object({
//     username: t.String({
//       minLength: 1,
//       error: 'Nama pengguna harus berupa string dan tidak boleh kosong',
//     }),

//     password: t.String({
//       minLength: 1,
//       error: 'Kata sandi harus berupa string dan tidak boleh kosong',
//     }),
//   }),

//   loginResponse: t.Object({
//     status: t.UnionEnum([Status.SUCCESS, Status.FAIL, Status.ERROR]),
//     message: t.String(),
//     data: t.Object({
//       id: t.String({ format: 'uuid' }),
//       username: t.String(),
//       accessToken: t.Optional(t.String()),
//       refreshToken: t.Optional(t.String()),
//     }),
//   }),

//   logoutParam: t.Object({
//     userId: t.String({
//       format: 'uuid',
//       error: 'ID pengguna harus berupa uuid',
//     }),
//     refreshToken: t.String(),
//   }),
// })
