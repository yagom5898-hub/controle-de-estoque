import { useState } from 'react'
import { useCollection, list } from '../../storage.js'
import { fmtDate } from '../../utils.js'

export default function Agenda() {
  const { items: agenda, create, remove } = useCollection('agenda')
  const clientes = list('clientes')
  const veiculos = list('veiculos')
  const [form, setForm] = useState({ data: new Date().toISOString(), hora:'', clienteId:'', veiculoId:'', servico:'' })
  function submit(e){
    e.preventDefault()
    create(form)
    setForm({ data: new Date().toISOString(), hora:'', clienteId:'', veiculoId:'', servico:'' })
  }
  const diaAtual = new Date(form.data).toISOString().slice(0,10)
  const itemsDia = agenda.filter(a=>a.data.slice(0,10)===diaAtual)
  return (
    <div className="grid">
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>Nova agenda</div>
        <form className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}} onSubmit={submit}>
          <input placeholder="Data" type="date" value={diaAtual} onChange={e=>setForm({...form, data: new Date(e.target.value).toISOString()})} />
          <input placeholder="Hora" value={form.hora} onChange={e=>setForm({...form, hora:e.target.value})} />
          <select value={form.clienteId} onChange={e=>setForm({...form, clienteId:e.target.value})} >
            <option value="">Cliente</option>
            {clientes.map(c=> <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select value={form.veiculoId} onChange={e=>setForm({...form, veiculoId:e.target.value})} >
            <option value="">Veículo</option>
            {veiculos.filter(v=>!form.clienteId || v.clienteId===form.clienteId).map(v=> <option key={v.id} value={v.id}>{v.placa} {v.modelo}</option>)}
          </select>
          <input placeholder="Serviço" value={form.servico} onChange={e=>setForm({...form, servico:e.target.value})} />
          <div className="row"><button type="submit">Adicionar</button></div>
        </form>
      </div>
      <div className="card pad">
        <div className="between"><div style={{fontWeight:700}}>Agenda do dia</div><div className="muted">{fmtDate(form.data)}</div></div>
        <table className="table">
          <thead><tr><th>Hora</th><th>Cliente</th><th>Veículo</th><th>Serviço</th><th></th></tr></thead>
          <tbody>
            {itemsDia.map(a=> {
              const c = clientes.find(c=>c.id===a.clienteId)
              const v = veiculos.find(v=>v.id===a.veiculoId)
              return (
                <tr key={a.id}>
                  <td>{a.hora}</td>
                  <td>{c?.nome}</td>
                  <td>{v?.placa} {v?.modelo}</td>
                  <td>{a.servico}</td>
                  <td><button className="ghost" onClick={()=>remove(a.id)}>Excluir</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
