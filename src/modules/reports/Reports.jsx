import { list } from '../../storage.js'
import { fmtCurrency } from '../../utils.js'

export default function Reports() {
  const os = list('os')
  const pecas = list('pecas')
  const clientes = list('clientes')
  const financeiro = list('financeiro')

  const receitaMensal = groupByMonth(financeiro.filter(f=>f.tipo==='entrada'))
  const servicosPorPeriodo = groupByMonth(os.map(o=> ({ data:o.data, valor:o.valor })))
  const usoPecas = countParts(os)
  const frequenciaClientes = countBy(os.map(o=>o.clienteId)).map(([id, qtd])=> ({ id, qtd, nome: clientes.find(c=>c.id===id)?.nome || 'Desconhecido' }))

  return (
    <div className="grid">
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>Receita mensal</div>
        <table className="table"><thead><tr><th>Mês</th><th>Valor</th></tr></thead><tbody>
          {receitaMensal.map(r=> <tr key={r.mes}><td>{r.mes}</td><td>{fmtCurrency(r.total)}</td></tr>)}
        </tbody></table>
      </div>
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>Serviços por período</div>
        <table className="table"><thead><tr><th>Mês</th><th>Serviços</th></tr></thead><tbody>
          {servicosPorPeriodo.map(r=> <tr key={r.mes}><td>{r.mes}</td><td>{r.qtd}</td></tr>)}
        </tbody></table>
      </div>
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>Peças mais utilizadas</div>
        <table className="table"><thead><tr><th>Peça</th><th>Usos</th></tr></thead><tbody>
          {usoPecas.map(u=> {
            const p = pecas.find(p=>p.id===u.pecaId)
            return <tr key={u.pecaId}><td>{p?.nome || u.pecaId}</td><td>{u.qtd}</td></tr>
          })}
        </tbody></table>
      </div>
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>Clientes mais frequentes</div>
        <table className="table"><thead><tr><th>Cliente</th><th>OS</th></tr></thead><tbody>
          {frequenciaClientes.map(f=> <tr key={f.id}><td>{f.nome}</td><td>{f.qtd}</td></tr>)}
        </tbody></table>
      </div>
    </div>
  )
}

function groupByMonth(items){
  const map = new Map()
  items.forEach(i => {
    const d = new Date(i.data)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const cur = map.get(key) || { mes: new Date(d.getFullYear(), d.getMonth(), 1).toLocaleString('pt-BR',{month:'long', year:'numeric'}), total: 0, qtd: 0 }
    map.set(key, { mes: cur.mes, total: cur.total + (i.valor||0), qtd: cur.qtd + 1 })
  })
  return Array.from(map.values()).sort((a,b)=> a.mes.localeCompare(b.mes))
}
function countParts(os){
  const counter = new Map()
  os.forEach(o => (o.itens||[]).forEach(i => {
    const cur = counter.get(i.pecaId)||0
    counter.set(i.pecaId, cur + (i.qtd||1))
  }))
  return Array.from(counter.entries()).map(([pecaId, qtd])=> ({ pecaId, qtd })).sort((a,b)=> b.qtd-a.qtd)
}
function countBy(arr){
  const map = new Map()
  arr.forEach(id => map.set(id, (map.get(id)||0) + 1))
  return Array.from(map.entries()).sort((a,b)=> b[1]-a[1])
}
