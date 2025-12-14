import { clamp } from '../utils.js'

export default function Chart({ type='line', data=[], labels=[], height=140 }) {
  const w = 360
  const h = height
  const pad = 24
  const max = Math.max(1, ...data)
  const points = data.map((v, i) => {
    const x = pad + (i * (w - pad*2) / Math.max(1, data.length-1))
    const y = pad + (h - pad*2) * (1 - clamp(v/max, 0, 1))
    return [x, y]
  })
  const path = points.map((p,i) => (i===0?'M':'L')+p[0]+','+p[1]).join(' ')
  const bars = data.map((v,i)=> {
    const bw = (w - pad*2) / data.length - 6
    const x = pad + i*((w - pad*2)/data.length) + 3
    const y = pad + (h - pad*2) * (1 - clamp(v/max, 0, 1))
    const bh = h - pad - y
    return { x, y, bw, bh }
  })
  return (
    <div className="card pad" style={{padding:12}}>
      <svg width={w} height={h}>
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#60a5fa"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="transparent" />
        <path d={`M${pad},${h-pad} L${w-pad},${h-pad}`} stroke="#243041" />
        {type==='line' && (
          <>
            <path d={path} stroke="url(#g)" fill="none" strokeWidth="2" />
            {points.map((p,i)=> <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#2dd4bf" />)}
          </>
        )}
        {type==='bar' && bars.map((b,i)=> <rect key={i} x={b.x} y={b.y} width={b.bw} height={b.bh} fill="url(#g)" rx="4" />)}
        {labels.length>0 && labels.map((l,i)=> (
          <text key={i} x={pad + i*((w - pad*2)/labels.length) + 6} y={h-6} fontSize="10" fill="#94a3b8">{l}</text>
        ))}
      </svg>
    </div>
  )
}
