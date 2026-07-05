import { fetchPassage } from '../services/bibleApi'
import { getVerseOfDay } from '../utils/verseOfDay'

const ENABLED_KEY = 'bible-app-daily-notification'
const LAST_KEY = 'bible-app-daily-notification-last'

export function isDailyNotificationEnabled(): boolean {
  return localStorage.getItem(ENABLED_KEY) === 'true'
}

export function setDailyNotificationEnabled(enabled: boolean): void {
  localStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false')
}

export async function requestDailyNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

export async function maybeShowDailyNotification(): Promise<void> {
  if (!isDailyNotificationEnabled()) return
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const today = new Date().toISOString().slice(0, 10)
  if (localStorage.getItem(LAST_KEY) === today) return

  try {
    const { verseId, topicName } = getVerseOfDay()
    const verse = await fetchPassage(verseId)
    const body = verse.text.length > 120 ? `${verse.text.slice(0, 117)}…` : verse.text

    new Notification(`Verse of the Day · ${topicName}`, {
      body: `${verse.reference}: ${body}`,
      icon: '/pwa-icon.svg',
      tag: 'verse-of-day',
    })
    localStorage.setItem(LAST_KEY, today)
  } catch {
    // API unavailable — skip notification
  }
}

export async function enableDailyNotifications(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (!('Notification' in window)) return 'unsupported'
  const permission = await requestDailyNotificationPermission()
  if (permission === 'granted') {
    setDailyNotificationEnabled(true)
    await maybeShowDailyNotification()
    return 'granted'
  }
  setDailyNotificationEnabled(false)
  return 'denied'
}

export function disableDailyNotifications(): void {
  setDailyNotificationEnabled(false)
}
