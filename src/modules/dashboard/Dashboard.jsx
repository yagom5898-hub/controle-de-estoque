import CardKPI from '../../components/CardKPI.jsx'
import Chart from '../../components/Chart.jsx'
import Icons from '../../components/Icons.jsx'
import { list } from '../../storage.js'
import { fmtCurrency, monthTicks, sum } from '../../utils.js'

export default function Dashboard() {
  const os = list('os')
  const clientes = list('clientes')
  const pecas = list('pecas')
  const financeiro = list('financeiro')
  const totalFaturado = sum(financeiro.filter(f=>f.tipo==='entrada').map(f=>f.valor))
  const peçasEmEstoque = sum(pecas.map(p=>p.qtd))

  const meses = monthTicks()
  const receitaMensal = meses.map((m,i)=> {
    const monthIdx = new Date().getMonth() - (meses.length-1-i)
    const dataFilter = new Date(new Date().getFullYear(), monthIdx, 1)
    return sum(financeiro.filter(f=> new Date(f.data).getMonth()===dataFilter.getMonth() && f.tipo==='entrada').map(f=>f.valor))
  })
  const entr = sum(financeiro.filter(f=>f.tipo==='entrada').map(f=>f.valor))
  const said = sum(financeiro.filter(f=>f.tipo==='saida').map(f=>f.valor))

  const recentes = os.slice(0, 6)

  return (
    <div className="grid">
      <div className="kpi">
        <CardKPI title="Ordens de Serviço" value={os.length} icon={<Icons.Wrench />} />
        <CardKPI title="Total faturado" value={totalFaturado} icon={<Icons.Cash />} />
        <CardKPI title="Clientes ativos" value={clientes.length} icon={<Icons.Client />} />
        <CardKPI title="Peças em estoque" value={peçasEmEstoque} icon={<Icons.Box />} />
      </div>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div>
          <div className="muted" style={{marginBottom:8}}>Receita mensal</div>
          <Chart type="line" data={receitaMensal} labels={meses} />
        </div>
        <div>
          <div className="muted" style={{marginBottom:8}}>Entradas x Saídas</div>
          <Chart type="bar" data={[entr, said]} labels={['Entradas', 'Saídas']} />
        </div>
      </div>
      <div className="card pad">
        <div className="between" style={{marginBottom:8}}>
          <div style={{fontWeight:700}}>Ordens recentes</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th><th>Veículo</th><th>Descrição</th><th>Status</th><th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {recentes.map(o=> {
              const c = list('clientes').find(c=>c.id===o.clienteId)
              const v = list('veiculos').find(v=>v.id===o.veiculoId)
              return (
                <tr key={o.id}>
                  <td>{c?.nome}</td>
                  <td>{v?.placa} {v?.modelo}</td>
                  <td>{o.descricao}</td>
                  <td>{o.status}</td>
                  <td>{fmtCurrency(o.valor)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
