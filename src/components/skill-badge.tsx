export function SkillBadge({ name }: { name: string }) {
  return (
    <span className="px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-sm text-text-secondary hover:bg-white/20 dark:hover:bg-white/10 hover:text-text-primary transition-all">
      {name}
    </span>
  )
}
