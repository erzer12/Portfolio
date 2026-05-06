type SectionRuleProps = {
  className?: string;
};

export function SectionRule({ className }: SectionRuleProps) {
  return <div className={['my-3 h-px bg-neutral-200', className].filter(Boolean).join(' ')} />;
}
