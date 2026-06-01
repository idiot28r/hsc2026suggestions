import { useEffect, useState } from 'react'

export interface ToastMsg {
  text: string
  kind?: 'ok' | 'err' | 'info'
  id?: number
}

export default function Toast({ msg }: { msg: ToastMsg | null }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!msg) return
    setShow(true)
    const t = setTimeout(() => setShow(false), 2200)
    return () => clearTimeout(t)
  }, [msg])

  return (
    <div className={`toast ${msg?.kind ?? 'info'} ${show ? 'show' : ''}`}>{msg?.text}</div>
  )
}
