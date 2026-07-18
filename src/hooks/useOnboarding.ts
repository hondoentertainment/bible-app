const STORAGE_KEY = 'bible-app-onboarding-dismissed'
const SHARE_TIP_KEY = 'bible-app-share-tip-dismissed'
const INSTALL_DISMISSED_KEY = 'bible-app-install-dismissed'

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

function writeFlag(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? 'true' : 'false')
  } catch {
    // ignore quota / private mode
  }
}

export function isOnboardingDismissed(): boolean {
  return readFlag(STORAGE_KEY)
}

export function dismissOnboarding(): void {
  writeFlag(STORAGE_KEY, true)
}

export function isShareTipDismissed(): boolean {
  return readFlag(SHARE_TIP_KEY)
}

export function dismissShareTip(): void {
  writeFlag(SHARE_TIP_KEY, true)
}

export function isInstallPromptDismissed(): boolean {
  return readFlag(INSTALL_DISMISSED_KEY)
}

export function dismissInstallPrompt(): void {
  writeFlag(INSTALL_DISMISSED_KEY, true)
}
