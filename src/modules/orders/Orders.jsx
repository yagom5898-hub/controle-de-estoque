import { useState } from 'react'
import { useCollection, list, setCollection } from '../../storage.js'
import { fmtCurrency } from '../../utils.js'

export default function Orders() {
  const { items: os, create, update, remove } = useCollection('os')
  const clientes = list('clientes')
  const veiculos = list('veiculos')
  const pecas = list('pecas')
  const [form, setForm] = useState({ clienteId:'', veiculoId:'', descricao:'', status:'Em andamento', valor:'', data:new Date().toISOString(), itens:[] })
  const [editing, setEditing] = useState(null)

  function addItem(pecaId){
    const current = form.itens || []
    const exists = current.find(i=>i.pecaId===pecaId)
    const next = exists ? current.map(i=> i.pecaId===pecaId ? {...i, qtd: i.qtd+1} : i) : [...current, { pecaId, qtd: 1 }]
    setForm({ ...form, itens: next })
  }
  function removeItem(pecaId){
    const next = (form.itens||[]).filter(i=>i.pecaId!==pecaId)
    setForm({ ...form, itens: next })
  }
  function submit(e){
    e.preventDefault()
    const payload = { ...form, valor: Number(form.valor||0) }
    if (editing) { update(editing, payload); setEditing(null) }
    else { 
      const created = create(payload)
      if (payload.status==='Concluído') applyStockAndFinance(created)
    }
    setForm({ clienteId:'', veiculoId:'', descricao:'', status:'Em andamento', valor:'', data:new Date().toISOString(), itens:[] })
  }
  function edit(o){
    setEditing(o.id)
    setForm({ clienteId:o.clienteId, veiculoId:o.veiculoId, descricao:o.descricao, status:o.status, valor:String(o.valor), data:o.data, itens:o.itens||[] })
  }
  function applyStockAndFinance(order){
    const stock = list('pecas')
    const nextStock = stock.map(p => {
      const usage = (order.itens||[]).find(i=>i.pecaId===p.id)
      return usage ? { ...p, qtd: Math.max(0, p.qtd - usage.qtd) } : p
    })
    setCollection('pecas', nextStock)
    const financeiro = list('financeiro')
    setCollection('financeiro', [{ id: Date.now().toString(), tipo: 'entrada', origem: 'Serviço', refId: order.id, valor: order.valor, data: order.data }, ...financeiro])
  }
  return (
    <div className="grid">
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>{editing ? 'Editar OS' : 'Nova OS'}</div>
        <form className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}} onSubmit={submit}>
          <select value={form.clienteId} onChange={e=>setForm({...form, clienteId:e.target.value})} required>
            <option value="">Cliente</option>
            {clientes.map(c=> <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select value={form.veiculoId} onChange={e=>setForm({...form, veiculoId:e.target.value})} required>
            <option value="">Veículo</option>
            {veiculos.filter(v=>!form.clienteId || v.clienteId===form.clienteId).map(v=> <option key={v.id} value={v.id}>{v.placa} {v.modelo}</option>)}
          </select>
          <input placeholder="Descrição do serviço" value={form.descricao} onChange={e=>setForm({...form, descricao:e.target.value})} required />
          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            <option>Em andamento</option>
            <option>Concluído</option>
          </select>
          <input placeholder="Valor" type="number" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} />
          <div className="row wrap">
            {pecas.map(p=> (
              <button key={p.id} type="button" className="ghost" onClick={()=>addItem(p.id)}>{p.nome} ({p.qtd})</button>
            ))}
          </div>
          <div className="grid" style={{gridColumn:'1/-1'}}>
            <div className="muted">Peças da OS</div>
            <table className="table">
              <thead><tr><th>Peça</th><th>Qtd</th><th></th></tr></thead>
              <tbody>
                {(form.itens||[]).map(i=> {
                  const p = pecas.find(p=>p.id===i.pecaId)
                  return (
                    <tr key={i.pecaId}>
                      <td>{p?.nome}</td>
                      <td>{i.qtd}</td>
                      <td><button type="button" className="ghost" onClick={()=>removeItem(i.pecaId)}>Remover</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="row">
            <button type="submit">{editing ? 'Salvar' : 'Adicionar'}</button>
            {editing && <button type="button" className="ghost" onClick={()=>{ setEditing(null); setForm({ clienteId:'', veiculoId:'', descricao:'', status:'Em andamento', valor:'', data:new Date().toISOString(), itens:[] }) }}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card pad">
        <div className="between"><div style={{fontWeight:700}}>Ordens de Serviço</div><div className="muted">{os.length} registros</div></div>
        <table className="table">
          <thead><tr><th>Cliente</th><th>Veículo</th><th>Serviço</th><th>Status</th><th>Valor</th><th></th></tr></thead>
          <tbody>
            {os.map(o=> {
              const c = clientes.find(c=>c.id===o.clienteId)
              const v = veiculos.find(v=>v.id===o.veiculoId)
              return (
                <tr key={o.id}>
                  <td>{c?.nome}</td>
                  <td>{v?.placa} {v?.modelo}</td>
                  <td>{o.descricao}</td>
                  <td>{o.status}</td>
                  <td>{fmtCurrency(o.valor)}</td>
                  <td className="row">
                    <button className="ghost" onClick={()=>edit(o)}>Editar</button>
                    <button className="ghost" onClick={()=>remove(o.id)}>Excluir</button>
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
