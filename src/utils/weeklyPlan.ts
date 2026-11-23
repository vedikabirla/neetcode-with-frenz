import type { WeeklyProgress } from '../types'

export const weeklyStorageKey = 'neetcode-with-frenz:weekly-progress:v1'

export function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function currentWeekStart(): string {
  const date = new Date()
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7))
  return localDateKey(date)
}

export function parseDate(date: string): Date {
  return new Date(`${date}T12:00:00`)
}

export function shiftDate(date: string, days: number): string {
  const shifted = parseDate(date)
  shifted.setDate(shifted.getDate() + days)
  return localDateKey(shifted)
}

export function isWebUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

export function readWeeklyProgress(): WeeklyProgress {
  try {
    return JSON.parse(localStorage.getItem(weeklyStorageKey) ?? '{}') ?? {}
  } catch {
    return {}
  }
}
