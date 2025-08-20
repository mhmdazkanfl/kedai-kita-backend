import Elysia, { t } from 'elysia'
import { ValueErrorType } from '@sinclair/typebox/errors'

export const enum Status {
  SUCCESS = 'success',
  FAIL = 'fail',
  ERROR = 'error',
}

export const authModel = new Elysia().model({
  registerBody: t.Object({
    username: t.String({
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$',
      error: ({ value, validator }) => {
        const type = validator.Errors(value).First()?.type

        switch (type) {
          case ValueErrorType.StringMinLength:
          case ValueErrorType.StringMaxLength:
            return 'Nama pengguna harus antara 3 sampai 20 karakter'
          case ValueErrorType.StringPattern:
            return 'Nama pengguna hanya boleh mengandung karakter alfanumerik dan garis bawah'
          case ValueErrorType.String:
          case ValueErrorType.Undefined:
            return 'Nama pengguna harus berupa string'
          default:
            return 'Format nama pengguna tidak valid.'
        }
      },
    }),

    password: t.String({
      minLength: 6,
      maxLength: 100,
      error: ({ value, validator }) => {
        const type = validator.Errors(value).First()?.type

        switch (type) {
          case ValueErrorType.StringMinLength:
          case ValueErrorType.StringMaxLength:
            return 'Kata sandi harus antara 6 sampai 100 karakter'
          case ValueErrorType.String:
          case ValueErrorType.Undefined:
            return 'Kata sandi harus berupa string'
          default:
            return 'Format kata sandi tidak valid.'
        }
      },
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
