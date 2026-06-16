import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { holdings } from '../data/demo'
import { ReducedMotionContext } from '../context'
import { useIsMobile } from '../hooks/useIsMobile'

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
  const [visible, setVisible] = useState(false)
  const reducedMotion = useContext(ReducedMotionContext)
  const isMobile = useIsMobile()
  const noMotion = reducedMotion || isMobile

  useEffect(() => {
    if (!outerRef.current) return
    if (noMotion) { setVisible(true); return }

    const enterTrigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top 80%',
      onEnter: () => setVisible(true),
    })
    const pinTrigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
    })
    return () => { enterTrigger.kill(); pinTrigger.kill() }
  }, [noMotion])

  const grid = (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
      {holdings.map((h, i) => (
        <div
          key={h.id}
          className="bg-ground-2 border border-rule rounded-lg p-4 md:p-5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
          }}
        >
          <p className="text-ink font-medium leading-snug mb-2 md:mb-3 text-sm md:text-base">{h.name}</p>
          <span className={`text-xs font-mono border rounded px-1.5 md:px-2 py-0.5 ${typeColor[h.type]}`}>
            {typeLabel[h.type]}
          </span>
          <p className="text-xl md:text-2xl font-mono text-ink mt-3 md:mt-4">{formatMoney(h.allocation)}</p>
        </div>
      ))}
    </div>
  )

  if (noMotion) {
    return (
      <section id="portfolio" aria-label="The portfolio" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-ink-mute text-base md:text-lg">This is the portfolio. Fifty million dollars of stated good intentions.</p>
        </div>
        {grid}
      </section>
    )
  }

  return (
    <section id="portfolio" aria-label="The portfolio" ref={outerRef} style={{ height: '250vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center px-4 md:px-8">
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
