import { useRef, useEffect, useContext } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { holdings } from '../data/demo'
import { ReducedMotionContext } from '../context'

const typeLabel: Record<string, string> = {
  public_equity: 'Listed equity',
  fund: 'Fund',
  private_debt: 'Private debt',
  private_equity: 'Private equity',
  grant: 'Grant',
}

const typeColor: Record<string, string> = {
  public_equity: 'text-ink-mute border-rule',
  fund: 'text-ink-mute border-rule',
  private_debt: 'text-support border-support-deep',
  private_equity: 'text-support border-support-deep',
  grant: 'text-gate border-gate',
}

function formatMoney(n: number) {
  return `$${(n / 1_000_000).toFixed(0)}M`
}

export default function Portfolio() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = useContext(ReducedMotionContext)

  useEffect(() => {
    if (reducedMotion || !outerRef.current) return

    gsap.set(cardRefs.current, { opacity: 0, y: 30 })

    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top 80%',
      end: 'top 20%',
      onEnter: () => {
        gsap.to(cardRefs.current, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        })
      },
      pin: false,
    })

    const pinTrigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
    })

    return () => { trigger.kill(); pinTrigger.kill() }
  }, [reducedMotion])

  const grid = (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {holdings.map((h, i) => (
        <div
          key={h.id}
          ref={el => { cardRefs.current[i] = el }}
          className={`bg-ground-2 border border-rule rounded-lg p-5 ${reducedMotion ? '' : 'opacity-0'}`}
        >
          <p className="text-ink font-medium leading-snug mb-3">{h.name}</p>
          <span className={`text-xs font-mono border rounded px-2 py-0.5 ${typeColor[h.type]}`}>
            {typeLabel[h.type]}
          </span>
          <p className="text-2xl font-mono text-ink mt-4">{formatMoney(h.allocation)}</p>
        </div>
      ))}
    </div>
  )

  if (reducedMotion) {
    return (
      <section id="portfolio" aria-label="The portfolio" className="py-24 px-8">
        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-ink-mute text-lg">This is the portfolio. Fifty million dollars of stated good intentions.</p>
        </div>
        {grid}
      </section>
    )
  }

  return (
    <section id="portfolio" aria-label="The portfolio" ref={outerRef} style={{ height: '250vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center px-8">
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-ink-mute text-lg leading-relaxed">
            This is the portfolio. Fifty million dollars of stated good intentions. Public companies, a fund, two private deals, a grant. Most tools would now give you a number. We're going to do something slower, and truer.
          </p>
        </div>
        {grid}
      </div>
    </section>
  )
}
