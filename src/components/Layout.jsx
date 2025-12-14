import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { list } from '../storage.js'
import { logout } from '../authService.js'
import Search from './Search.jsx'
import Icons from './Icons.jsx'

export default function Layout() {
  const navigate = useNavigate()
  const osCount = list('os').length
  return (
    <div className="content">
      <aside className="sidebar">
        <div className="row" style={{marginBottom: 16}}>
          <img src="/am360.svg" alt="logo" width={28} height={28} />
          <div>
            <div style={{fontWeight:700}}>AutoManager 360</div>
            <div className="muted" style={{fontSize:12}}>Local</div>
          </div>
        </div>
        <nav className="grid">
          <NavLink to="/" className="card pad row"><Icons.Dashboard /> Dashboard</NavLink>
          <NavLink to="/clientes" className="card pad row"><Icons.Client /> Clientes</NavLink>
          <NavLink to="/veiculos" className="card pad row"><Icons.Car /> Veículos</NavLink>
          <NavLink to="/os" className="card pad row"><Icons.Wrench /> Ordens de Serviço <span className="muted" style={{marginLeft:'auto'}}>{osCount}</span></NavLink>
          <NavLink to="/estoque" className="card pad row"><Icons.Box /> Estoque</NavLink>
          <NavLink to="/financeiro" className="card pad row"><Icons.Cash /> Financeiro</NavLink>
          <NavLink to="/agenda" className="card pad row"><Icons.Calendar /> Agenda</NavLink>
          <NavLink to="/relatorios" className="card pad row"><Icons.Report /> Relatórios</NavLink>
          <NavLink to="/backup" className="card pad row"><Icons.Backup /> Backup</NavLink>
        </nav>
        <div style={{marginTop:24}} className="grid">
          <button className="ghost" onClick={() => { logout(); navigate('/login') }}>Sair</button>
        </div>
      </aside>
      <main>
        <header className="header between">
          <Search />
          <div className="row">
            <span className="muted">100% Offline</span>
          </div>
        </header>
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
