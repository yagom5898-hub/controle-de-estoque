const DB_KEY = 'am360'
const CURRENT_USER_KEY = 'currentUser'

function readDB(){
  try { const raw = localStorage.getItem(DB_KEY); return raw ? JSON.parse(raw) : {} } catch { return {} }
}
function writeDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)) }

function hex(arr){ return arr.map(b=> b.toString(16).padStart(2,'0')).join('') }
function utf8Bytes(str){
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str)
  const out = []
  for (let i=0;i<str.length;i++){
    let c = str.charCodeAt(i)
    if (c<128) out.push(c)
    else if (c<2048) { out.push((c>>6)|192, (c&63)|128) }
    else if ((c&0xFC00)===0xD800 && i+1<str.length && (str.charCodeAt(i+1)&0xFC00)===0xDC00){
      c = 0x10000 + ((c&0x3FF)<<10) + (str.charCodeAt(++i)&0x3FF)
      out.push((c>>18)|240, ((c>>12)&63)|128, ((c>>6)&63)|128, (c&63)|128)
    } else out.push((c>>12)|224, ((c>>6)&63)|128, (c&63)|128)
  }
  return new Uint8Array(out)
}
function sha256Fallback(bytes){
  const K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555084734,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]
  let H0=1779033703,H1=3144134277,H2=1013904242,H3=2773480762,H4=1359893119,H5=2600822924,H6=528734635,H7=1541459225
  const l=bytes.length
  const bitLen=l*8
  const withOne=new Uint8Array(((l+9+63)>>6)<<6)
  withOne.set(bytes)
  withOne[l]=0x80
  withOne[withOne.length-4]=(bitLen>>>24)&0xFF
  withOne[withOne.length-3]=(bitLen>>>16)&0xFF
  withOne[withOne.length-2]=(bitLen>>>8)&0xFF
  withOne[withOne.length-1]=(bitLen)&0xFF
  const W=new Uint32Array(64)
  for(let i=0;i<withOne.length;i+=64){
    for(let j=0;j<16;j++){
      const idx=i+j*4
      W[j]=(withOne[idx]<<24)|(withOne[idx+1]<<16)|(withOne[idx+2]<<8)|(withOne[idx+3])
    }
    for(let j=16;j<64;j++){
      const s0=((W[j-15]>>>7)|(W[j-15]<<25))^((W[j-15]>>>18)|(W[j-15]<<14))^(W[j-15]>>>3)
      const s1=((W[j-2]>>>17)|(W[j-2]<<15))^((W[j-2]>>>19)|(W[j-2]<<13))^(W[j-2]>>>10)
      W[j]=(W[j-16]+s0+W[j-7]+s1)>>>0
    }
    let a=H0,b=H1,c=H2,d=H3,e=H4,f=H5,g=H6,h=H7
    for(let j=0;j<64;j++){
      const S1=((e>>>6)|(e<<26))^((e>>>11)|(e<<21))^((e>>>25)|(e<<7))
      const ch=(e&f)^(~e&g)
      const t1=(h+S1+ch+K[j]+W[j])>>>0
      const S0=((a>>>2)|(a<<30))^((a>>>13)|(a<<19))^((a>>>22)|(a<<10))
      const maj=(a&b)^(a&c)^(b&c)
      const t2=(S0+maj)>>>0
      h=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0
    }
    H0=(H0+a)>>>0; H1=(H1+b)>>>0; H2=(H2+c)>>>0; H3=(H3+d)>>>0; H4=(H4+e)>>>0; H5=(H5+f)>>>0; H6=(H6+g)>>>0; H7=(H7+h)>>>0
  }
  const out=new Uint8Array(32)
  const words=[H0,H1,H2,H3,H4,H5,H6,H7]
  for(let i=0;i<8;i++){ out[i*4]=(words[i]>>>24)&0xFF; out[i*4+1]=(words[i]>>>16)&0xFF; out[i*4+2]=(words[i]>>>8)&0xFF; out[i*4+3]=words[i]&0xFF }
  return hex(Array.from(out))
}
async function hashPassword(password){
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function'){
      const enc = utf8Bytes(password)
      const buf = await crypto.subtle.digest('SHA-256', enc)
      return hex(Array.from(new Uint8Array(buf)))
    }
    return sha256Fallback(utf8Bytes(password))
  } catch {
    return sha256Fallback(utf8Bytes(password))
  }
}

export async function createUser({ name, username, password }){
  const db = readDB()
  db.users ||= []
  const exists = db.users.find(u=>u.username===username)
  if (exists) throw new Error('Usuário já existe')
  const passwordHash = await hashPassword(password)
  const user = { id: crypto.randomUUID?.() || (Math.random().toString(36).slice(2)), name, username, passwordHash, createdAt: new Date().toISOString() }
  db.users.unshift(user)
  writeDB(db)
  return user
}

export async function login({ username, password }){
  const db = readDB(); db.users ||= []
  const user = db.users.find(u=>u.username===username)
  if (!user) throw new Error('Usuário não encontrado')
  const hash = await hashPassword(password)
  if (user.passwordHash !== hash) throw new Error('Senha inválida')
  localStorage.setItem(CURRENT_USER_KEY, user.id)
  return user
}

export function logout(){ localStorage.removeItem(CURRENT_USER_KEY) }

export function getCurrentUser(){
  const db = readDB(); db.users ||= []
  const id = localStorage.getItem(CURRENT_USER_KEY)
  return db.users.find(u=>u.id===id) || null
}

export async function changePassword({ currentPassword, newPassword }){
  const db = readDB(); db.users ||= []
  const id = localStorage.getItem(CURRENT_USER_KEY)
  const user = db.users.find(u=>u.id===id)
  if (!user) throw new Error('Sessão inválida')
  const curHash = await hashPassword(currentPassword)
  if (user.passwordHash !== curHash) throw new Error('Senha atual incorreta')
  user.passwordHash = await hashPassword(newPassword)
  writeDB(db)
}

export const _internal = { readDB, writeDB, hashPassword }

