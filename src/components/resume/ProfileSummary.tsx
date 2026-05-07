type ProfileSummaryProps = {
  summary: string;
};

export function ProfileSummary({ summary }: ProfileSummaryProps) {
  return <p className="max-w-3xl text-[15px] leading-7 text-[--ink-muted]">{summary}</p>;
}
