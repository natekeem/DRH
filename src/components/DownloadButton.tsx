import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DownloadButton({ filename, text, label }:{filename:string;text:string;label:string}){
  const [url,setUrl]=useState('')
  useEffect(()=>{
    const type=filename.endsWith('.html')?'text/html':filename.endsWith('.md')?'text/markdown':filename.endsWith('.json')?'application/json':filename.endsWith('.css')?'text/css':'text/plain'
    const next=URL.createObjectURL(new Blob([text],{type:type+';charset=utf-8'}))
    setUrl(next)
    return()=>URL.revokeObjectURL(next)
  },[filename,text])
  return <a className="download-button" href={url||undefined} download={filename} aria-disabled={!url}><Download size={15}/>{label}</a>
}
