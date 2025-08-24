export function createJWTExp(option: {
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
}): number {
  const totalSeconds =
    (option.seconds ?? 0) +
    (option.minutes ?? 0) * 60 +
    (option.hours ?? 0) * 60 * 60 +
    (option.days ?? 0) * 24 * 60 * 60

  return Math.floor(Date.now() / 1000) + totalSeconds
}
