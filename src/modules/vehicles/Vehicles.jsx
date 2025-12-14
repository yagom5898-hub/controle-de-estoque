import { useState } from 'react'
import { useCollection, list } from '../../storage.js'

export default function Vehicles() {
  const { items: veiculos, create, update, remove } = useCollection('veiculos')
  const clientes = list('clientes')
  const [form, setForm] = useState({ placa:'', modelo:'', marca:'', ano:'', clienteId:'' })
  const [editing, setEditing] = useState(null)
  function submit(e){
    e.preventDefault()
    const payload = { ...form, ano: Number(form.ano||0) }
    if (editing) { update(editing, payload); setEditing(null) }
    else { create(payload) }
    setForm({ placa:'', modelo:'', marca:'', ano:'', clienteId:'' })
  }
  function edit(v){
    setEditing(v.id)
    setForm({ placa:v.placa, modelo:v.modelo, marca:v.marca, ano:String(v.ano), clienteId:v.clienteId||'' })
  }
  return (
    <div className="grid">
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>{editing ? 'Editar veículo' : 'Novo veículo'}</div>
        <form className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}} onSubmit={submit}>
          <input placeholder="Placa" value={form.placa} onChange={e=>setForm({...form, placa:e.target.value})} required />
          <input placeholder="Modelo" value={form.modelo} onChange={e=>setForm({...form, modelo:e.target.value})} required />
          <input placeholder="Marca" value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})} required />
          <input placeholder="Ano" type="number" value={form.ano} onChange={e=>setForm({...form, ano:e.target.value})} />
          <select value={form.clienteId} onChange={e=>setForm({...form, clienteId:e.target.value})}>
            <option value="">Cliente vinculado</option>
            {clientes.map(c=> <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <div className="row">
            <button type="submit">{editing ? 'Salvar' : 'Adicionar'}</button>
            {editing && <button type="button" className="ghost" onClick={()=>{ setEditing(null); setForm({ placa:'', modelo:'', marca:'', ano:'', clienteId:'' }) }}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card pad">
        <div className="between"><div style={{fontWeight:700}}>Veículos</div><div className="muted">{veiculos.length} registros</div></div>
        <table className="table">
          <thead>
            <tr><th>Placa</th><th>Modelo</th><th>Marca</th><th>Ano</th><th>Cliente</th><th></th></tr>
          </thead>
          <tbody>
            {veiculos.map(v=> {
              const c = clientes.find(c=>c.id===v.clienteId)
              return (
                <tr key={v.id}>
                  <td>{v.placa}</td>
                  <td>{v.modelo}</td>
                  <td>{v.marca}</td>
                  <td>{v.ano}</td>
                  <td>{c?.nome || '-'}</td>
                  <td className="row">
                    <button className="ghost" onClick={()=>edit(v)}>Editar</button>
                    <button className="ghost" onClick={()=>remove(v.id)}>Excluir</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
