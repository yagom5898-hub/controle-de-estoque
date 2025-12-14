import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as authLogin } from '../../authService.js'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  function submit(e){
    e.preventDefault()
    setLoading(true)
    authLogin({ username, password })
      .then(()=> navigate('/'))
      .catch(err => setError(err.message || 'Falha no login'))
      .finally(()=> setLoading(false))
  }
  return (
    <div style={{display:'grid', placeItems:'center', height:'100%', padding:16}}>
      <div className="card" style={{width:'100%', maxWidth:420, padding:24}}>
        <div className="row" style={{marginBottom:12}}>
          <img src="/am360.svg" alt="logo" width={28} height={28} />
          <div>
            <div style={{fontWeight:700}}>AutoManager 360</div>
            <div className="muted" style={{fontSize:12}}>Acesso local</div>
          </div>
        </div>
        <form className="grid" style={{gap:12}} onSubmit={submit}>
          <input placeholder="Usuário" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="danger">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          <div className="row" style={{justifyContent:'space-between'}}>
            <Link to="/auth/register" className="muted">Criar conta</Link>
            <Link to="/auth/change" className="muted">Trocar senha</Link>
          </div>
        </form>
        <div className="muted" style={{marginTop:12, fontSize:12}}>Autenticação local, sem backend.</div>
      </div>
    </div>
  )
}

export function Register(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', username:'', password:'', confirm:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  async function submit(e){
    e.preventDefault(); setError(''); setSuccess('')
    if (!form.password || form.password!==form.confirm){ setError('Senhas não coincidem'); return }
    try {
      const { createUser } = await import('../../authService.js')
      await createUser({ name: form.name, username: form.username, password: form.password })
      setSuccess('Conta criada com sucesso'); setTimeout(()=> navigate('/login'), 800)
    } catch(err){ setError(err.message || 'Falha ao criar conta') }
  }
  return (
    <div style={{display:'grid', placeItems:'center', height:'100%', padding:16}}>
      <div className="card" style={{width:'100%', maxWidth:520, padding:24}}>
        <div style={{fontWeight:700, marginBottom:8}}>Criar conta</div>
        <form className="grid" style={{gap:12}} onSubmit={submit}>
          <input placeholder="Nome" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input placeholder="Usuário" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
          <input placeholder="Senha" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
          <input placeholder="Confirmar senha" type="password" value={form.confirm} onChange={e=>setForm({...form, confirm:e.target.value})} required />
          {error && <div className="danger">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="row">
            <button type="submit">Criar</button>
            <button type="button" className="ghost" onClick={()=>navigate('/login')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ChangePassword(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ current:'', next:'', confirm:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  async function submit(e){
    e.preventDefault(); setError(''); setSuccess('')
    if (!form.next || form.next!==form.confirm){ setError('Nova senha não coincide'); return }
    try {
      const { changePassword } = await import('../../authService.js')
      await changePassword({ currentPassword: form.current, newPassword: form.next })
      setSuccess('Senha alterada'); setTimeout(()=> navigate('/'), 800)
    } catch(err){ setError(err.message || 'Falha ao alterar senha') }
  }
  return (
    <div style={{display:'grid', placeItems:'center', height:'100%', padding:16}}>
      <div className="card" style={{width:'100%', maxWidth:520, padding:24}}>
        <div style={{fontWeight:700, marginBottom:8}}>Trocar senha</div>
        <form className="grid" style={{gap:12}} onSubmit={submit}>
          <input placeholder="Senha atual" type="password" value={form.current} onChange={e=>setForm({...form, current:e.target.value})} required />
          <input placeholder="Nova senha" type="password" value={form.next} onChange={e=>setForm({...form, next:e.target.value})} required />
          <input placeholder="Confirmar nova senha" type="password" value={form.confirm} onChange={e=>setForm({...form, confirm:e.target.value})} required />
          {error && <div className="danger">{error}</div>}
          {success && <div className="success">{success}</div>}
          <div className="row">
            <button type="submit">Salvar</button>
            <button type="button" className="ghost" onClick={()=>navigate('/')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

Login.Register = Register
Login.ChangePassword = ChangePassword
