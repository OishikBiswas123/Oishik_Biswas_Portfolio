import { Download, Eye } from "lucide-react"

export function ResumeButton() {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="/Oishik_Biswas_Resume.pdf"
        target="_blank"
        className="inline-flex items-center gap-2 px-6 py-3 border border-border-light text-text-primary text-sm uppercase tracking-widest hover:bg-bg-muted transition-colors"
      >
        <Eye size={16} />
        View
      </a>
      <a
        href="/Oishik_Biswas_Resume.pdf"
        download
        className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-base text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        <Download size={16} />
        Download
      </a>
    </div>
  )
}
