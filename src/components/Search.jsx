import { useMemo, useState } from 'react'
import { list, find } from '../storage.js'
import { useNavigate } from 'react-router-dom'

export default function Search() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const options = useMemo(() => {
    const clientes = list('clientes')
    const veiculos = list('veiculos')
    const os = list('os')
    const items = []
    clientes.forEach(c => items.push({ label: `Cliente: ${c.nome}`, to: '/clientes', id: c.id }))
    veiculos.forEach(v => items.push({ label: `Veículo: ${v.placa} ${v.modelo}`, to: '/veiculos', id: v.id }))
    os.forEach(o => items.push({ label: `OS: ${o.descricao}`, to: '/os', id: o.id }))
    return items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()))
  }, [q])

  return (
    <div className="row" style={{width:'100%', maxWidth:520}}>
      <input placeholder="Buscar clientes, veículos, OS..." value={q} onChange={e=>setQ(e.target.value)} />
      <button className="ghost" onClick={() => setQ('')}>Limpar</button>
      {q && (
        <div className="card" style={{position:'absolute', top:50, width:520, maxHeight:280, overflow:'auto', zIndex:100}}>
          {options.map(opt => (
            <div key={opt.id} className="row pad" style={{padding:12, borderBottom:'1px solid #243041', cursor:'pointer'}} onClick={()=>navigate(opt.to)}>
              {opt.label}
            </div>
          ))}
          {options.length===0 && <div className="muted" style={{padding:12}}>Sem resultados</div>}
        </div>
      )}
    </div>
  )
}
