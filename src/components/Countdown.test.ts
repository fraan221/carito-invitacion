import { describe, it, expect } from 'vitest'
import { calculateTimeRemaining } from './Countdown'

describe('calculateTimeRemaining', () => {
  it('calculates exact days, hours, minutes, and seconds remaining', () => {
    const now = new Date('2027-02-01T12:00:00Z')
    const target = new Date('2027-02-06T21:00:00Z')

    const remaining = calculateTimeRemaining(target, now)

    // Diff: 5 days, 9 hours, 0 minutes, 0 seconds
    expect(remaining.days).toBe(5)
    expect(remaining.hours).toBe(9)
    expect(remaining.minutes).toBe(0)
    expect(remaining.seconds).toBe(0)
    expect(remaining.isExpired).toBe(false)
  })

  it('handles arbitrary hours, minutes and seconds accurately', () => {
    const now = new Date('2027-02-06T19:15:30Z')
    const target = new Date('2027-02-06T21:00:00Z')

    const remaining = calculateTimeRemaining(target, now)

    expect(remaining.days).toBe(0)
    expect(remaining.hours).toBe(1)
    expect(remaining.minutes).toBe(44)
    expect(remaining.seconds).toBe(30)
    expect(remaining.isExpired).toBe(false)
  })

  it('returns zeroes and isExpired true when target date has passed or is now', () => {
    const now = new Date('2027-02-07T00:00:00Z')
    const target = new Date('2027-02-06T21:00:00Z')

    const remaining = calculateTimeRemaining(target, now)

    expect(remaining.days).toBe(0)
    expect(remaining.hours).toBe(0)
    expect(remaining.minutes).toBe(0)
    expect(remaining.seconds).toBe(0)
    expect(remaining.isExpired).toBe(true)
  })

  it('accepts string date representations', () => {
    const now = new Date('2027-02-05T21:00:00Z')
    const remaining = calculateTimeRemaining('2027-02-06T21:00:00Z', now)

    expect(remaining.days).toBe(1)
    expect(remaining.hours).toBe(0)
    expect(remaining.minutes).toBe(0)
    expect(remaining.seconds).toBe(0)
    expect(remaining.isExpired).toBe(false)
  })
})
