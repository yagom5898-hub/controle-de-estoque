import { fmtCurrency } from '../utils.js'

export default function CardKPI({ title, value, icon, accent='var(--primary)' }) {
  return (
    <div className="card pad" style={{display:'flex', gap:12, alignItems:'center', padding:16}}>
      <div style={{background:'rgba(45,212,191,.1)', border:'1px solid #243041', borderRadius:12, padding:10, color:accent}}>
        {icon}
      </div>
      <div style={{flex:1}}>
        <div className="muted" style={{fontSize:12}}>{title}</div>
        <div style={{fontSize:22, fontWeight:700}}>{typeof value==='number' ? fmtCurrency(value) : value}</div>
      </div>
    </div>
  )
}
