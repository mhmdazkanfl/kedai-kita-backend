import { describe, expect, it, jest } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import auth from '../src/auth'
import db from '../src/database'
import { ResponseStatus } from '../src/common/enum'

const api = treaty(auth)

describe('Authentication', () => {
  it('success register response', async () => {
    const payload = {
      username: 'testuser',
      password: 'testpass',
    }

    const { data, status } = await api.auth.register.post(payload)

    expect(status).toBeWithin(200, 299)
    expect(data).toEqual({
      status: ResponseStatus.SUCCESS,
      message: expect.any(String),
      data: {
        id: expect.any(String),
        username: payload.username,
      },
    })
  })

  it('fail register response', async () => {
    const payload = {
      username: '',
      password: '',
    }

    const { data, status } = await api.auth.register.post(payload)

    expect(status).toBeWithin(400, 499)
    expect(data).toEqual({
      status: ResponseStatus.FAIL,
      message: expect.any(String),
    })
  })

  it('error register response', async () => {
    const payload = {
      username: 'testuser',
      password: 'testpass',
    }

    jest.spyOn(db, 'insert').mockImplementation(() => {
      throw new Error('DB connection failed')
    })

    const { data, status } = await api.auth.register.post(payload)

    expect(status).toBeWithin(500, 599)
    expect(data).toEqual({
      status: ResponseStatus.ERROR,
      message: expect.any(String),
    })
  })
})
