const KEY = 'am360'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getSession() {
  const db = read()
  return db?.session || null
}
export function setSession(session) {
  const db = read() || {}
  db.session = session
  write(db)
}
export function logout() {
  const db = read() || {}
  db.session = null
  write(db)
}

function collection(name) {
  const db = read() || {}
  db[name] ||= []
  write(db)
  return db[name]
}
export function setCollection(name, items) {
  const db = read() || {}
  db[name] = items
  write(db)
}
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function list(name) { return collection(name) }
export function create(name, item) {
  const items = collection(name)
  const next = { id: uid(), ...item }
  setCollection(name, [next, ...items])
  return next
}
export function update(name, id, patch) {
  const items = collection(name)
  const next = items.map(it => it.id === id ? { ...it, ...patch } : it)
  setCollection(name, next)
}
export function remove(name, id) {
  const items = collection(name)
  const next = items.filter(it => it.id !== id)
  setCollection(name, next)
}
export function find(name, id) {
  const items = collection(name)
  return items.find(it => it.id === id) || null
}
export function clearAll() { write({}) }

export function seedIfEmpty() {
  const db = read()
  if (db) return
  const now = new Date()
  write({
    session: null,
    users: [],
    clientes: [
      { id: 'c1', nome: 'João Silva', telefone: '11 99999-0000', email: 'joao@exemplo.com', obs: 'Cliente VIP' },
      { id: 'c2', nome: 'Maria Souza', telefone: '11 98888-1111', email: 'maria@exemplo.com', obs: '' }
    ],
    veiculos: [
      { id: 'v1', placa: 'ABC-1234', modelo: 'Civic', marca: 'Honda', ano: 2018, clienteId: 'c1' },
      { id: 'v2', placa: 'XYZ-9876', modelo: 'Gol', marca: 'VW', ano: 2012, clienteId: 'c2' }
    ],
    pecas: [
      { id: 'p1', nome: 'Filtro de óleo', qtd: 12, valor: 39.9 },
      { id: 'p2', nome: 'Pastilha de freio', qtd: 6, valor: 129.9 },
      { id: 'p3', nome: 'Correia dentada', qtd: 3, valor: 199.0 }
    ],
    os: [
      { id: 'o1', clienteId: 'c1', veiculoId: 'v1', descricao: 'Troca de óleo e filtro', status: 'Concluído', valor: 199.9, data: now.toISOString(), itens: [{ pecaId: 'p1', qtd: 1 }] },
      { id: 'o2', clienteId: 'c2', veiculoId: 'v2', descricao: 'Revisão freios', status: 'Em andamento', valor: 0, data: now.toISOString(), itens: [] }
    ],
    financeiro: [
      { id: 'f1', tipo: 'entrada', origem: 'Serviço', refId: 'o1', valor: 199.9, data: now.toISOString() },
      { id: 'f2', tipo: 'saida', origem: 'Compra', refId: null, valor: 89.9, data: now.toISOString() }
    ],
    agenda: [
      { id: 'a1', data: now.toISOString(), hora: '10:00', clienteId: 'c1', veiculoId: 'v1', servico: 'Troca de pneus' }
    ]
  })
}

export function exportAll() {
  const db = read() || {}
  return JSON.stringify(db, null, 2)
}
export function importAll(json) {
  const parsed = JSON.parse(json)
  write(parsed)
}

export function useCollection(name) {
  const items = list(name)
  return {
    items,
    create: (item) => create(name, item),
    update: (id, patch) => update(name, id, patch),
    remove: (id) => remove(name, id)
  }
}
