import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface UserParams {
  phone: string | null
  name: string
  isGuest: boolean
  /** Query string (with leading `?`) carrying phone/name, to preserve across links. */
  carry: string
}

/**
 * Reads the brritto-app login context that is passed in via the URL
 * (`?phone=...&name=...`). When absent, the user is treated as a guest.
 */
export function useUserParams(): UserParams {
  const [params] = useSearchParams()
  return useMemo(() => {
    const phone = params.get('phone')
    const name = params.get('name') || 'Student'
    const carry = new URLSearchParams()
    if (phone) {
      carry.set('phone', phone)
      carry.set('name', name)
    }
    const carryStr = carry.toString()
    return {
      phone,
      name,
      isGuest: !phone,
      carry: carryStr ? `?${carryStr}` : '',
    }
  }, [params])
}
