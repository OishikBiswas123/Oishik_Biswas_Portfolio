import { Download, Eye } from "lucide-react"

export function ResumeButton() {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="/Oishik_Biswas_Resume.pdf"
        target="_blank"
        className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full text-sm uppercase tracking-widest text-text-secondary hover:bg-white/10 dark:hover:bg-white/5 hover:text-text-primary transition-all"
      >
        <Eye size={16} />
        View
      </a>
      <a
        href="/Oishik_Biswas_Resume.pdf"
        download
        className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm uppercase tracking-widest text-text-primary hover:bg-white/30 dark:hover:bg-white/20 transition-all"
      >
        <Download size={16} />
        Download
      </a>
    </div>
  )
}
