import { exportAll, importAll, clearAll } from '../../storage.js'

export default function Backup() {
  function exportData(){
    const blob = new Blob([exportAll()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'am360-backup.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
  function importData(ev){
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { importAll(reader.result); alert('Dados importados. Recarregue a página.'); }
    reader.readAsText(file)
  }
  function reset(){
    if (confirm('Restaurar sistema e limpar todos os dados?')) { clearAll(); location.reload() }
  }
  return (
    <div className="grid">
      <div className="card pad">
        <div style={{fontWeight:700, marginBottom:8}}>Backup manual</div>
        <div className="row">
          <button onClick={exportData}>Exportar JSON</button>
          <label className="ghost" style={{border:'1px solid #243041', padding:'10px 14px', borderRadius:10, cursor:'pointer'}}>
            Importar JSON
            <input type="file" accept="application/json" onChange={importData} style={{display:'none'}} />
          </label>
          <button className="ghost" onClick={reset}>Restaurar Sistema</button>
        </div>
        <div className="muted" style={{marginTop:12}}>Backup local, nenhum dado sai do seu dispositivo.</div>
      </div>
    </div>
  )
}
