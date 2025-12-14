import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { seedIfEmpty } from './storage.js'
import { getCurrentUser } from './authService.js'
import Layout from './components/Layout.jsx'
import Login from './modules/login/Login.jsx'
import Dashboard from './modules/dashboard/Dashboard.jsx'
import Clients from './modules/clients/Clients.jsx'
import Vehicles from './modules/vehicles/Vehicles.jsx'
import Orders from './modules/orders/Orders.jsx'
import Inventory from './modules/inventory/Inventory.jsx'
import Finance from './modules/finance/Finance.jsx'
import Agenda from './modules/agenda/Agenda.jsx'
import Reports from './modules/reports/Reports.jsx'
import Backup from './modules/backup/Backup.jsx'

function RequireAuth({ children }) {
  const session = getCurrentUser()
  const location = useLocation()
  if (!session?.username) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export default function App() {
  useEffect(() => { seedIfEmpty() }, [])
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/register" element={<Login.Register />} />
      <Route path="/auth/change" element={<Login.ChangePassword />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/veiculos" element={<Vehicles />} />
        <Route path="/os" element={<Orders />} />
        <Route path="/estoque" element={<Inventory />} />
        <Route path="/financeiro" element={<Finance />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/backup" element={<Backup />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
