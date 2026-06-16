import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { modes } from '../data/demo'
import { ReducedMotionContext } from '../context'
import { useIsMobile } from '../hooks/useIsMobile'

const mandateParts = [
  { text: "This Trust holds the family's capital for the long benefit of ", highlight: false },
  { text: "the communities we are part of", highlight: true },
  { text: ", and for those who come after us. We want our capital to help people ", highlight: false },
  { text: "belong — to one another and to a place", highlight: true },
  { text: ". We want it to support ", highlight: false },
  { text: "health and vitality", highlight: true },
  { text: ", and to protect the ", highlight: false },
  { text: "dignity of every person", highlight: true },
  { text: " our enterprises touch. Where we can, we want to widen people's ", highlight: false },
  { text: "agency over their own lives", highlight: true },
  { text: ", and support the kind of ", highlight: false },
  { text: "understanding that helps a community see clearly", highlight: true },
  { text: ". We do not wish to profit from the erosion of the very things we are trying to build. We would rather know the truth about our portfolio than be reassured by it.", highlight: false },
]

export default function Mandate() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useContext(ReducedMotionContext)
  const isMobile = useIsMobile()
  const noMotion = reducedMotion || isMobile

  useEffect(() => {
    if (noMotion || !outerRef.current) return
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
  }, [noMotion])

  const highlightCount = mandateParts.filter(p => p.highlight).length
  let hIdx = 0
  const p = noMotion ? 1 : progress

  const content = (
    <div className="max-w-5xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      <div className="bg-ground-2 rounded-lg p-5 md:p-8 border border-rule">
        <p className="text-xs font-mono text-ink-mute uppercase tracking-widest mb-4">
          The Holloway Family Trust — Investment Mandate (extract)
        </p>
        <blockquote className="text-ink leading-relaxed text-base md:text-lg italic">
          {mandateParts.map((part, i) => {
            if (!part.highlight) return <span key={i}>{part.text}</span>
            const thisIdx = hIdx++
            const revealed = p > thisIdx / highlightCount
            return (
              <span
                key={i}
                style={{
                  color: revealed ? 'var(--gate)' : 'var(--ink)',
                  transition: 'color 0.4s ease',
                }}
              >
                {part.text}
              </span>
            )
          })}
        </blockquote>
      </div>
      <div className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-0">
        {modes.map((m, i) => {
          const revealed = p > (i / modes.length) * 0.5 + 0.5
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 md:gap-4"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-support flex-shrink-0" />
              <div>
                <span className="text-ink font-medium text-sm md:text-base">{m.label}</span>
                <span className="text-ink-mute text-xs md:text-sm ml-2 md:ml-3">↳ {m.shadow}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  if (noMotion) {
    return (
      <section id="mandate" aria-label="The mandate" className="py-16 md:py-24">
        {content}
        <div className="max-w-2xl mx-auto px-4 md:px-8 mt-8 md:mt-16 space-y-4 text-ink-mute">
          <p>Every mandate is a statement of love — for people, places, a future.</p>
          <p>We keep it in the client's own words first. Then we translate it into something we can measure against — six modes of love, each with a shadow it can collapse into.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="mandate" aria-label="The mandate" ref={outerRef} style={{ height: '350vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center py-8">
        {content}
        <div className="max-w-2xl mx-auto px-4 md:px-8 mt-8 md:mt-12 space-y-4 text-ink-mute text-lg">
          <p>Every mandate is a statement of love — for people, places, a future.</p>
          <p>We keep it in the client's own words first. Then we translate it into something we can measure against — six modes of love, each with a shadow it can collapse into.</p>
        </div>
      </div>
    </section>
  )
}
