import { useRef, useState, useEffect, useContext } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReducedMotionContext } from './Walkthrough'

interface SceneProps {
  id: string
  height?: string
  children: (progress: number) => React.ReactNode
  narration: React.ReactNode
  ariaLabel: string
}

export default function Scene({ id, height = '300vh', children, narration, ariaLabel }: SceneProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useContext(ReducedMotionContext)

  useEffect(() => {
    if (reducedMotion || !outerRef.current || !stickyRef.current) return

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

  if (reducedMotion) {
    return (
      <section id={id} aria-label={ariaLabel} className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          {children(1)}
          <div className="mt-16">{narration}</div>
        </div>
      </section>
    )
  }

  return (
    <section id={id} aria-label={ariaLabel} ref={outerRef} style={{ height }}>
      <div ref={stickyRef} className="h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          {children(progress)}
        </div>
      </div>
      <div className="sr-only">{narration}</div>
    </section>
  )
}
