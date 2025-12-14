import { useState } from 'react'
import { useCollection, list } from '../../storage.js'
import Chart from '../../components/Chart.jsx'
import { fmtCurrency } from '../../utils.js'

export default function Finance() {
  const { items: financeiro, create, remove } = useCollection('financeiro')
  const [form, setForm] = useState({ tipo:'saida', origem:'Despesa', valor:'', data:new Date().toISOString() })
  function submit(e){
    e.preventDefault()
    const payload = { ...form, valor: Number(form.valor||0) }
    create(payload)
    setForm({ tipo:'saida', origem:'Despesa', valor:'', data:new Date().toISOString() })
  }
  const entradas = financeiro.filter(f=>f.tipo==='entrada').map(f=>f.valor)
  const saídas = financeiro.filter(f=>f.tipo==='saida').map(f=>f.valor)
  const saldo = (entradas.reduce((a,b)=>a+b,0) - saídas.reduce((a,b)=>a+b,0))
  const labels = ['Entradas', 'Saídas']
  const data = [entradas.reduce((a,b)=>a+b,0), saídas.reduce((a,b)=>a+b,0)]

  return (
    <div className="grid">
      <div className="card pad">
        <div className="between"><div style={{fontWeight:700}}>Saldo</div><div style={{fontSize:20, fontWeight:700}}>{fmtCurrency(saldo)}</div></div>
        <Chart type="bar" data={data} labels={labels} />
      </div>
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>Nova movimentação</div>
        <form className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gap:12}} onSubmit={submit}>
          <select value={form.tipo} onChange={e=>setForm({...form, tipo:e.target.value})}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <input placeholder="Origem" value={form.origem} onChange={e=>setForm({...form, origem:e.target.value})} />
          <input placeholder="Valor" type="number" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} />
          <div className="row">
            <button type="submit">Adicionar</button>
          </div>
        </form>
      </div>
      <div className="card pad">
        <div className="between"><div style={{fontWeight:700}}>Movimentações</div><div className="muted">{financeiro.length} registros</div></div>
        <table className="table">
          <thead><tr><th>Tipo</th><th>Origem</th><th>Valor</th><th></th></tr></thead>
          <tbody>
            {financeiro.map(f=> (
              <tr key={f.id}>
                <td>{f.tipo}</td>
                <td>{f.origem}</td>
                <td>{fmtCurrency(f.valor)}</td>
                <td><button className="ghost" onClick={()=>remove(f.id)}>Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
