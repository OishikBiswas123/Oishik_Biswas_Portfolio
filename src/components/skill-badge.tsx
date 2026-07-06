export function SkillBadge({ name }: { name: string }) {
  return (
    <span className="px-4 py-2 border border-border-light text-sm text-text-secondary hover:bg-accent hover:text-text-primary transition-colors">
      {name}
    </span>
  )
}
