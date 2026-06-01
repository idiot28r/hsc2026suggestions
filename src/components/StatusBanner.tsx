import type { UserParams } from '../lib/useUserParams'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

/**
 * Student-facing status strip. Inside the brritto in-app browser a logged-in
 * student sees only their name + live save status. Guests (and local dev) get
 * no banner at all — the student side carries no debug/demo messaging.
 */
export default function StatusBanner({ user, saveState }: { user: UserParams; saveState?: SaveState }) {
  if (user.isGuest) return null

  let tail = ''
  if (saveState === 'saving') tail = ' · ⏳ সংরক্ষণ হচ্ছে…'
  else if (saveState === 'saved') tail = ' · ✅ সংরক্ষিত'
  else if (saveState === 'error') tail = ' · ❌ সংরক্ষণে সমস্যা'

  return (
    <div className="banner user">
      <span className="dot" style={{ background: '#10b981' }} />
      👤 {user.name}{tail}
    </div>
  )
}
