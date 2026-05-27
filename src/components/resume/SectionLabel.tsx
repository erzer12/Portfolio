type SectionLabelProps = {
  children: React.ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[--ink-bright]">{children}</h2>;
}
