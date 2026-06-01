import type { UserParams } from '../lib/useUserParams'
import { dataMode } from '../lib/data'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

/**
 * Student-facing status strip. A logged-in student sees their name + live save
 * status. A guest (no phone) is warned their progress isn't being saved — except
 * in local demo mode, where guest progress persists to localStorage anyway.
 */
export default function StatusBanner({ user, saveState }: { user: UserParams; saveState?: SaveState }) {
  if (user.isGuest) {
    if (dataMode === 'local') return null
    return (
      <div className="banner guest">
        <span className="dot" style={{ background: 'currentColor' }} />
        ⚠️ গেস্ট মোড — তোমার অগ্রগতি সংরক্ষণ হচ্ছে না
      </div>
    )
  }

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
