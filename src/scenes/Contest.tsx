import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReducedMotionContext } from '../context'

export default function Contest() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useContext(ReducedMotionContext)

  useEffect(() => {
    if (reducedMotion || !outerRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
      scrub: 0.5,
      onUpdate: (self) => setProgress(self.progress),
    })
    return () => trigger.kill()
  }, [reducedMotion])

  // Attempted net at 0.7 progress, then pull apart
  const attemptNet = progress > 0.65 && progress < 0.85
  const netOffset = attemptNet ? Math.sin((progress - 0.65) / 0.2 * Math.PI) * 30 : 0

  const flows = [
    { label: 'Affordable staple foods', target: 'Vitality', polarity: 'support' as const, width: 0.5 },
    { label: 'Affordable staple foods', target: 'Belonging', polarity: 'support' as const, width: 0.2 },
    { label: 'Ultra-processed snacks', target: 'Vitality', polarity: 'erosion' as const, width: 0.6 },
    { label: 'Formula marketing', target: 'Dignity', polarity: 'erosion' as const, width: 0.4 },
    { label: 'Formula marketing', target: 'Vitality', polarity: 'erosion' as const, width: 0.2 },
  ]

  const show = reducedMotion ? 1 : progress

  return (
    <section id="contest" aria-label="Support and erosion in contest" ref={outerRef} style={{ height: '300vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center items-center px-4 md:px-8 gap-8">
        <p className="text-ink-mute text-lg text-center max-w-2xl leading-relaxed">
          The good and the harm are both real. Averaging is how honesty dies. Both flows stay on the page, at full strength, in different colours. You are allowed to hold a contradiction.
        </p>

        <div className="max-w-2xl w-full space-y-3">
          {flows.map((f, i) => {
            const color = f.polarity === 'support' ? 'var(--support)' : 'var(--erosion)'
            const y = f.polarity === 'support' ? -netOffset : netOffset
            return (
              <div
                key={i}
                className="flex items-center gap-4 transition-all duration-300"
                style={{ transform: `translateY(${y}px)`, opacity: Math.min(1, show * 2 - i * 0.2) }}
              >
                <span className="text-ink-mute text-sm w-32 md:w-48 text-right">{f.label}</span>
                <div className="flex-1 h-3 bg-rule rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-700"
                    style={{ width: `${f.width * 100}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-sm w-20" style={{ color }}>
                  {f.target}
                </span>
              </div>
            )
          })}

          {attemptNet && (
            <p className="text-center text-xs font-mono text-gate animate-pulse">
              ↕ netting refused — flows held separate
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
