import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import type { SankeyNode, SankeyLink } from 'd3-sankey'
import { holdings, modes, causalWeight, exposureWeight } from '../data/demo'
import { ReducedMotionContext } from '../context'

type ViewMode = 'causal' | 'exposure'

interface SNode {
  id: string
  label: string
  type: 'holding' | 'activity' | 'mode'
  holdingId?: string
  evidenceGrade?: string
  isGrant?: boolean
}

interface SLink {
  source: number
  target: number
  value: number
  polarity: 'support' | 'erosion'
  evidenceGrade: string
  holdingId: string
  activityLabel: string
  modeLabel: string
  additionalityNote?: string
  isGrant: boolean
}

function buildGraph(viewMode: ViewMode) {
  const nodes: SNode[] = []
  const links: SLink[] = []

  const nodeMap = new Map<string, number>()
  const addNode = (id: string, node: SNode) => {
    if (!nodeMap.has(id)) {
      nodeMap.set(id, nodes.length)
      nodes.push(node)
    }
    return nodeMap.get(id)!
  }

  modes.forEach(m => {
    addNode(`mode:${m.id}`, { id: `mode:${m.id}`, label: m.label, type: 'mode' })
  })

  holdings.forEach(h => {
    const weight = viewMode === 'causal' ? causalWeight(h) : exposureWeight(h)
    if (weight < 1) return

    const hIdx = addNode(`holding:${h.id}`, {
      id: `holding:${h.id}`, label: h.name, type: 'holding',
      holdingId: h.id, evidenceGrade: h.evidenceGrade,
      isGrant: h.type === 'grant',
    })

    h.activities.forEach(a => {
      const activityWeight = weight / h.activities.length

      const aIdx = addNode(`activity:${a.id}`, {
        id: `activity:${a.id}`, label: a.label, type: 'activity', holdingId: h.id,
      })

      links.push({
        source: hIdx,
        target: aIdx,
        value: activityWeight,
        polarity: 'support',
        evidenceGrade: h.evidenceGrade,
        holdingId: h.id,
        activityLabel: a.label,
        modeLabel: '',
        isGrant: h.type === 'grant',
        additionalityNote: h.additionality.note,
      })

      a.impacts.forEach(imp => {
        const modeIdx = nodeMap.get(`mode:${imp.mode}`)!
        links.push({
          source: aIdx,
          target: modeIdx,
          value: activityWeight * imp.magnitude,
          polarity: imp.polarity,
          evidenceGrade: h.evidenceGrade,
          holdingId: h.id,
          activityLabel: a.label,
          modeLabel: imp.mode,
          isGrant: h.type === 'grant',
          additionalityNote: h.additionality.note,
        })
      })
    })
  })

  return { nodes, links }
}

function getLinkColor(link: SLink, opacity = 0.6): string {
  const isLowEvidence = link.evidenceGrade === 'C' || link.evidenceGrade === 'D'
  if (link.polarity === 'support') {
    return isLowEvidence ? `rgba(47, 107, 82, ${opacity})` : `rgba(79, 178, 134, ${opacity})`
  } else {
    return isLowEvidence ? `rgba(126, 63, 37, ${opacity})` : `rgba(194, 104, 63, ${opacity})`
  }
}

export default function LoveSankey() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('causal')
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const reducedMotion = useContext(ReducedMotionContext)

  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 768
      const margin = isMobile ? 32 : 64
      const w = Math.min(window.innerWidth - margin, 1000)
      const h = Math.min(window.innerHeight - 200, 600)
      setDimensions({ width: w, height: h })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (reducedMotion || !outerRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
      scrub: 0.5,
    })
    return () => trigger.kill()
  }, [reducedMotion])

  const { nodes, links } = buildGraph(viewMode)
  const { width, height } = dimensions
  // On narrow screens, keep a minimum width so labels don't squish — the
  // container scrolls horizontally instead.
  const svgWidth = Math.max(600, width)

  const sankeyLayout = sankey<SNode, SLink>()
    .nodeId(((_d: any, i: number) => i) as any)
    .nodeWidth(16)
    .nodePadding(10)
    // Inset left/right so end-anchored node labels have room and aren't
    // clipped by the horizontally-scrollable container on mobile.
    .extent([[140, 1], [svgWidth - 60, height - 1]])

  let sankeyData: { nodes: (SNode & SankeyNode<SNode, SLink>)[]; links: (SLink & SankeyLink<SNode, SLink>)[] } | null = null
  try {
    sankeyData = sankeyLayout({ nodes: nodes.map(n => ({ ...n })), links: links.map(l => ({ ...l })) }) as any
  } catch (e) {
    console.error('Sankey error', e)
  }

  const linkPath = sankeyLinkHorizontal()

  return (
    <section id="sankey" aria-label="The Love Sankey" ref={outerRef} style={{ height: '400vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center items-center px-4 gap-4">
        <div className="flex items-center justify-between w-full px-4">
          <p className="text-ink-mute text-sm max-w-md leading-relaxed">
            This is the portfolio, told honestly. Flip between what you <em className="text-ink not-italic">caused</em> and what you're <em className="text-ink not-italic">attached to</em>.
          </p>
          <div className="flex bg-ground-2 rounded-lg border border-rule overflow-hidden">
            {(['causal', 'exposure'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                aria-pressed={viewMode === v}
                className={`px-4 py-2 text-sm font-mono transition-colors ${
                  viewMode === v ? 'bg-support text-ground' : 'text-ink-mute hover:text-ink'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="relative" style={{ overflowX: 'auto', width: '100%' }}>
          <svg
            ref={svgRef}
            width={svgWidth}
            height={height}
            className="overflow-visible"
          >
            {sankeyData && (
              <>
                {sankeyData.links.map((link, i) => {
                  const path = linkPath(link as any)
                  const color = getLinkColor(link as unknown as SLink)
                  const strokeWidth = Math.max(1, (link.width as number) || 1)
                  return (
                    <g key={i}>
                      <path
                        d={path || ''}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeOpacity={0.6}
                        className="transition-all duration-500 cursor-pointer"
                        onMouseEnter={(e) => {
                          const l = link as unknown as SLink
                          setTooltip({
                            x: e.clientX,
                            y: e.clientY,
                            content: `${l.holdingId} → ${l.activityLabel}${l.modeLabel ? ' → ' + l.modeLabel : ''}\n${l.polarity} · Grade ${l.evidenceGrade}${l.isGrant ? '\n⚠ Coherence assessed — outcome not verified' : ''}`,
                          })
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                      {(link as unknown as SLink).isGrant && path && (
                        <circle
                          cx={((link.source as any).x1 + (link.target as any).x0) / 2}
                          cy={(link.y0! + link.y1!) / 2}
                          r={4}
                          fill="var(--gate)"
                          opacity={0.8}
                        />
                      )}
                    </g>
                  )
                })}

                {sankeyData.nodes.map((node, i) => {
                  const n = node as unknown as SNode & { x0: number; x1: number; y0: number; y1: number }
                  const isMode = n.type === 'mode'
                  const isHolding = n.type === 'holding'
                  return (
                    <g key={i}>
                      <rect
                        x={n.x0}
                        y={n.y0}
                        width={n.x1 - n.x0}
                        height={Math.max(1, n.y1 - n.y0)}
                        fill={isMode ? 'var(--ink-mute)' : isHolding ? 'var(--rule)' : 'var(--rule)'}
                        rx={2}
                      />
                      <text
                        x={isMode ? n.x1 + 6 : n.x0 - 6}
                        y={(n.y0 + n.y1) / 2}
                        dy="0.35em"
                        textAnchor={isMode ? 'start' : 'end'}
                        fill="var(--ink-mute)"
                        fontSize={10}
                        fontFamily="monospace"
                      >
                        {n.label.length > 18 ? n.label.slice(0, 18) + '…' : n.label}
                      </text>
                    </g>
                  )
                })}
              </>
            )}
          </svg>

          {tooltip && (
            <div
              className="fixed z-50 bg-ground-2 border border-rule rounded p-3 text-xs font-mono text-ink-mute pointer-events-none max-w-xs whitespace-pre-line"
              style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
            >
              {tooltip.content}
            </div>
          )}
        </div>

        <div className="flex gap-6 text-xs font-mono">
          <span className="flex items-center gap-2">
            <span className="w-4 h-1 inline-block rounded" style={{ backgroundColor: 'var(--support)' }} />
            Support
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-1 inline-block rounded" style={{ backgroundColor: 'var(--erosion)' }} />
            Erosion
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--gate)' }} />
            Coherence assessed
          </span>
        </div>
      </div>
    </section>
  )
}
