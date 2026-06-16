import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { holdings } from '../data/demo'
import { ReducedMotionContext } from '../context'

const meridian = holdings.find(h => h.id === 'meridian')!

export default function Decompose() {
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

  const p = reducedMotion ? 1 : progress
  const polarityColor = (pol: string) => pol === 'support' ? 'var(--support)' : 'var(--erosion)'

  return (
    <section id="decompose" aria-label="Decomposition" ref={outerRef} style={{ height: '300vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center items-center px-4 md:px-8 gap-8">
        <div className="max-w-2xl w-full">
          <p className="text-ink-mute text-lg leading-relaxed mb-8">
            A company is not one thing. This food maker feeds people cheaply — and also sells sugar to children and markets formula where clean water is scarce. So we don't attribute to the company. We break every holding down to the activities underneath, and attribute to those.
          </p>
        </div>

        {/* Original card fades out as activities appear */}
        <div
          className="bg-ground-2 border border-rule rounded-lg p-5 w-full max-w-xs text-center"
          style={{ opacity: 1 - p * 1.5, transition: 'opacity 0.3s ease' }}
        >
          <p className="text-ink font-medium">Meridian Foods plc</p>
          <p className="text-ink-mute text-sm font-mono mt-1">$12M · Listed equity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
          {meridian.activities.map((a, i) => (
            <div
              key={a.id}
              className="bg-ground-2 border border-rule rounded-lg p-4"
              style={{
                opacity: Math.max(0, p * 3 - i * 0.5),
                transform: `translateY(${Math.max(0, (1 - p) * 20)}px)`,
                transition: 'none',
              }}
            >
              <p className="text-ink text-sm leading-snug mb-3">{a.label}</p>
              {a.impacts.map((imp, j) => (
                <div key={j} className="text-xs font-mono" style={{ color: polarityColor(imp.polarity) }}>
                  {imp.polarity === 'support' ? '↑' : '↓'} {imp.mode}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
