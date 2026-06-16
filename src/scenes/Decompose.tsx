import { useRef, useEffect, useContext } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { holdings } from '../data/demo'
import { ReducedMotionContext } from '../components/Walkthrough'

const meridian = holdings.find(h => h.id === 'meridian')!

export default function Decompose() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const activityRefs = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = useContext(ReducedMotionContext)

  useEffect(() => {
    if (reducedMotion || !outerRef.current) return

    gsap.set(activityRefs.current, { opacity: 0, y: 20 })

    const tl = gsap.timeline({ paused: true })
    tl.to(cardRef.current, { y: -20, scale: 0.95, opacity: 0.5, duration: 0.3 })
    tl.to(activityRefs.current, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 0.2)

    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
      scrub: 0.5,
      onUpdate: (self) => tl.progress(self.progress),
    })

    return () => { trigger.kill(); tl.kill() }
  }, [reducedMotion])

  const polarityColor = (p: string) => p === 'support' ? 'text-support' : 'text-erosion'

  return (
    <section id="decompose" aria-label="Decomposition" ref={outerRef} style={{ height: '300vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center items-center px-8 gap-8">
        <div className="max-w-2xl w-full">
          <p className="text-ink-mute text-lg leading-relaxed mb-8">
            A company is not one thing. This food maker feeds people cheaply — and also sells sugar to children and markets formula where clean water is scarce. So we don't attribute to the company. We break every holding down to the activities underneath, and attribute to those.
          </p>
        </div>

        <div ref={cardRef} className="bg-ground-2 border border-rule rounded-lg p-5 w-64 text-center">
          <p className="text-ink font-medium">Meridian Foods plc</p>
          <p className="text-ink-mute text-sm font-mono mt-1">$12M · Listed equity</p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-3xl w-full">
          {meridian.activities.map((a, i) => (
            <div
              key={a.id}
              ref={el => { activityRefs.current[i] = el }}
              className={`bg-ground-2 border border-rule rounded-lg p-4 ${reducedMotion ? '' : 'opacity-0'}`}
            >
              <p className="text-ink text-sm leading-snug mb-3">{a.label}</p>
              {a.impacts.map((imp, j) => (
                <div key={j} className={`text-xs font-mono ${polarityColor(imp.polarity)}`}>
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
