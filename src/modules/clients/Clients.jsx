import { useState } from 'react'
import { useCollection } from '../../storage.js'
import { fmtDate } from '../../utils.js'

export default function Clients() {
  const { items: clientes, create, update, remove } = useCollection('clientes')
  const [form, setForm] = useState({ nome:'', telefone:'', email:'', obs:'' })
  const [editing, setEditing] = useState(null)

  function submit(e){
    e.preventDefault()
    if (editing) { update(editing, form); setEditing(null) }
    else { create(form) }
    setForm({ nome:'', telefone:'', email:'', obs:'' })
  }
  function edit(c){
    setEditing(c.id)
    setForm({ nome:c.nome, telefone:c.telefone, email:c.email, obs:c.obs })
  }
  return (
    <div className="grid">
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>{editing ? 'Editar cliente' : 'Novo cliente'}</div>
        <form className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}} onSubmit={submit}>
          <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} required />
          <input placeholder="Telefone" value={form.telefone} onChange={e=>setForm({...form, telefone:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input placeholder="Observações" value={form.obs} onChange={e=>setForm({...form, obs:e.target.value})} />
          <div className="row">
            <button type="submit">{editing ? 'Salvar' : 'Adicionar'}</button>
            {editing && <button type="button" className="ghost" onClick={()=>{ setEditing(null); setForm({ nome:'', telefone:'', email:'', obs:'' }) }}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card pad">
        <div className="between"><div style={{fontWeight:700}}>Clientes</div><div className="muted">{clientes.length} registros</div></div>
        <table className="table">
          <thead>
            <tr><th>Nome</th><th>Telefone</th><th>Email</th><th>Obs</th><th></th></tr>
          </thead>
          <tbody>
            {clientes.map(c=> (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.telefone}</td>
                <td>{c.email}</td>
                <td>{c.obs}</td>
                <td className="row">
                  <button className="ghost" onClick={()=>edit(c)}>Editar</button>
                  <button className="ghost" onClick={()=>remove(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
