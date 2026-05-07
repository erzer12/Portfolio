type SectionRuleProps = {
  className?: string;
};

export function SectionRule({ className }: SectionRuleProps) {
  return <div className={['my-3 h-px bg-[--rule]', className].filter(Boolean).join(' ')} />;
}
