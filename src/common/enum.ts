export const ResponseStatus = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
} as const

export type ResponseStatusType =
  (typeof ResponseStatus)[keyof typeof ResponseStatus]
