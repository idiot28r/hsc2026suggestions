import { useTheme } from '../lib/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label={dark ? 'লাইট মোড' : 'ডার্ক মোড'}
      title={dark ? 'লাইট মোড' : 'ডার্ক মোড'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
