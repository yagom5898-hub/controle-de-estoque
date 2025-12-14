import { useState } from 'react'
import { useCollection } from '../../storage.js'

export default function Inventory() {
  const { items: pecas, create, update, remove } = useCollection('pecas')
  const [form, setForm] = useState({ nome:'', qtd:'', valor:'' })
  const [editing, setEditing] = useState(null)
  function submit(e){
    e.preventDefault()
    const payload = { ...form, qtd: Number(form.qtd||0), valor: Number(form.valor||0) }
    if (editing) { update(editing, payload); setEditing(null) }
    else { create(payload) }
    setForm({ nome:'', qtd:'', valor:'' })
  }
  function edit(p){
    setEditing(p.id)
    setForm({ nome:p.nome, qtd:String(p.qtd), valor:String(p.valor) })
  }
  return (
    <div className="grid">
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>{editing ? 'Editar peça' : 'Nova peça'}</div>
        <form className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}} onSubmit={submit}>
          <input placeholder="Nome da peça" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} required />
          <input placeholder="Quantidade" type="number" value={form.qtd} onChange={e=>setForm({...form, qtd:e.target.value})} />
          <input placeholder="Valor unitário" type="number" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} />
          <div className="row">
            <button type="submit">{editing ? 'Salvar' : 'Adicionar'}</button>
            {editing && <button type="button" className="ghost" onClick={()=>{ setEditing(null); setForm({ nome:'', qtd:'', valor:'' }) }}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card pad">
        <div className="between"><div style={{fontWeight:700}}>Estoque</div><div className="muted">{pecas.length} itens</div></div>
        <table className="table">
          <thead><tr><th>Peça</th><th>Qtd</th><th>Valor</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {pecas.map(p=> {
              const low = p.qtd <= 2
              return (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.qtd}</td>
                  <td>{p.valor.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                  <td className={low ? 'warning' : 'muted'}>{low ? 'Baixo estoque' : 'OK'}</td>
                  <td className="row">
                    <button className="ghost" onClick={()=>edit(p)}>Editar</button>
                    <button className="ghost" onClick={()=>remove(p.id)}>Excluir</button>
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
