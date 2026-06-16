import { useEffect, useState } from 'react'
import { modes } from '../data/demo'

export default function ScrollRail() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setActiveIndex(Math.min(5, Math.floor(scrolled * 6)))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 items-center">
      <div className="w-px bg-rule absolute inset-y-0 left-1/2 -translate-x-1/2" />
      {modes.map((m, i) => (
        <div key={m.id} className="relative flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i === activeIndex ? 'bg-support' : 'bg-rule'
            }`}
          />
          <span className={`text-xs transition-opacity duration-300 ${
            i === activeIndex ? 'opacity-100 text-ink-mute' : 'opacity-0'
          }`}>
            {m.label}
          </span>
        </div>
      ))}
    </div>
  )
}
