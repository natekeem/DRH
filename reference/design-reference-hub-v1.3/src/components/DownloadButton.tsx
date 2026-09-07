import { Download } from 'lucide-react'

export function DownloadButton({ filename, text, label }:{filename:string;text:string;label:string}){
  const download=()=>{
    const blob=new Blob([text],{type:'text/plain;charset=utf-8'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a')
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove()
    setTimeout(()=>URL.revokeObjectURL(url),500)
  }
  return <button className="download-button" type="button" onClick={download}><Download size={15}/>{label}</button>
}
