// Function overloads for type safety
export function createDateTime(option: {
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  weeks?: number
  months?: number
  years?: number
  fromDate?: Date
  returnType: 'date'
}): Date

export function createDateTime(option: {
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  weeks?: number
  months?: number
  years?: number
  fromDate?: Date
  returnType?: 'unix' | undefined
}): number

export function createDateTime(option: {
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  weeks?: number
  months?: number
  years?: number
  fromDate?: Date
  returnType?: 'date' | 'unix'
}): Date | number {
  // Use provided date or current date as base
  const baseDate = option.fromDate ? new Date(option.fromDate) : new Date()

  // Calculate total milliseconds to add/subtract
  const totalMilliseconds =
    (option.seconds ?? 0) * 1000 +
    (option.minutes ?? 0) * 60 * 1000 +
    (option.hours ?? 0) * 60 * 60 * 1000 +
    (option.days ?? 0) * 24 * 60 * 60 * 1000 +
    (option.weeks ?? 0) * 7 * 24 * 60 * 60 * 1000

  // Handle months and years separately for accuracy
  if (option.months || option.years) {
    baseDate.setFullYear(
      baseDate.getFullYear() + (option.years ?? 0),
      baseDate.getMonth() + (option.months ?? 0),
    )
  }

  // Add the calculated milliseconds
  const resultDate = new Date(baseDate.getTime() + totalMilliseconds)

  if (option.returnType === 'date') {
    return resultDate
  }

  return Math.floor(resultDate.getTime() / 1000)
}
