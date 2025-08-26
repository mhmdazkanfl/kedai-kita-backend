const ResponseStatus = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
} as const

type ResponseStatusType = (typeof ResponseStatus)[keyof typeof ResponseStatus]

export { ResponseStatus }
export type { ResponseStatusType }
