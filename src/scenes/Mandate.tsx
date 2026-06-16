import { useRef, useEffect, useContext } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { modes } from '../data/demo'
import { ReducedMotionContext } from '../context'

const mandateParts = [
  { text: "This Trust holds the family's capital for the long benefit of ", highlight: false },
  { text: "the communities we are part of", highlight: true, mode: 'belonging' },
  { text: ", and for those who come after us. We want our capital to help people ", highlight: false },
  { text: "belong — to one another and to a place", highlight: true, mode: 'belonging' },
  { text: ". We want it to support ", highlight: false },
  { text: "health and vitality", highlight: true, mode: 'vitality' },
  { text: ", and to protect the ", highlight: false },
  { text: "dignity of every person", highlight: true, mode: 'dignity' },
  { text: " our enterprises touch. Where we can, we want to widen people's ", highlight: false },
  { text: "agency over their own lives", highlight: true, mode: 'agency' },
  { text: ", and support the kind of ", highlight: false },
  { text: "understanding that helps a community see clearly", highlight: true, mode: 'wisdom' },
  { text: ". We do not wish to profit from the erosion of the very things we are trying to build. We would rather know the truth about our portfolio than be reassured by it.", highlight: false },
]

export default function Mandate() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const phraseRefs = useRef<(HTMLSpanElement | null)[]>([])
  const modeRefs = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = useContext(ReducedMotionContext)

  useEffect(() => {
    if (reducedMotion || !outerRef.current) return

    const highlights = phraseRefs.current.filter((_r, i) => mandateParts[i]?.highlight)
    const tl = gsap.timeline({ paused: true })

    highlights.forEach((el, i) => {
      if (!el) return
      tl.to(el, { color: 'var(--gate)', duration: 0.3 }, i * 0.15)
    })
    modes.forEach((_, i) => {
      const el = modeRefs.current[i]
      if (!el) return
      tl.to(el, { opacity: 1, y: 0, duration: 0.4 }, i * 0.15 + 0.3)
    })

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

  const content = (
    <div className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-start">
      <div className="bg-ground-2 rounded-lg p-8 border border-rule">
        <p className="text-xs font-mono text-ink-mute uppercase tracking-widest mb-4">
          The Holloway Family Trust — Investment Mandate (extract)
        </p>
        <blockquote className="text-ink leading-relaxed text-lg italic">
          {mandateParts.map((part, i) => (
            <span
              key={i}
              ref={el => { phraseRefs.current[i] = el }}
              className={`transition-colors duration-300 ${reducedMotion && part.highlight ? 'text-gate' : ''}`}
            >
              {part.text}
            </span>
          ))}
        </blockquote>
      </div>
      <div className="flex flex-col gap-4">
        {modes.map((m, i) => (
          <div
            key={m.id}
            ref={el => { modeRefs.current[i] = el }}
            className={`flex items-center gap-4 ${reducedMotion ? '' : 'opacity-0 translate-y-4'}`}
          >
            <div className="w-2 h-2 rounded-full bg-support flex-shrink-0" />
            <div>
              <span className="text-ink font-medium">{m.label}</span>
              <span className="text-ink-mute text-sm ml-3">↳ {m.shadow}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (reducedMotion) {
    return (
      <section id="mandate" aria-label="The mandate" className="py-24">
        {content}
        <div className="max-w-2xl mx-auto px-8 mt-16 space-y-4 text-ink-mute">
          <p>Every mandate is a statement of love — for people, places, a future.</p>
          <p>We keep it in the client's own words first. Then we translate it into something we can measure against — six modes of love, each with a shadow it can collapse into.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="mandate" aria-label="The mandate" ref={outerRef} style={{ height: '350vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center py-16">
        {content}
        <div className="max-w-2xl mx-auto px-8 mt-12 space-y-4 text-ink-mute text-lg">
          <p>Every mandate is a statement of love — for people, places, a future.</p>
          <p>We keep it in the client's own words first. Then we translate it into something we can measure against — six modes of love, each with a shadow it can collapse into.</p>
        </div>
      </div>
    </section>
  )
}
