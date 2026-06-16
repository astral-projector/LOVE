import { useContext } from 'react'
import { ReducedMotionContext } from '../context'

export default function ColdOpen() {
  const reducedMotion = useContext(ReducedMotionContext)

  return (
    <section
      id="cold-open"
      aria-label="Introduction"
      className="h-screen flex flex-col items-center justify-center relative"
    >
      <p className="text-ink-mute text-sm tracking-widest uppercase mb-16 font-mono">Throughline</p>
      <p className="text-3xl md:text-5xl text-ink text-center max-w-2xl leading-tight mb-4">
        Your capital is always making promises.
      </p>
      <p className="text-3xl md:text-5xl text-ink text-center max-w-2xl leading-tight">
        This is how you find out whether they're kept.
      </p>
      <div
        className={`absolute bottom-12 ${reducedMotion ? '' : 'animate-bounce'}`}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-mute">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  )
}
