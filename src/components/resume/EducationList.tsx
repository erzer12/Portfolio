type EducationListProps = {
  items: Array<{
    school: string;
    year: string;
    degree: string;
  }>;
};

export function EducationList({ items }: EducationListProps) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article key={`${item.school}-${item.year}`} className="space-y-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-[15px] font-medium text-neutral-900">{item.school}</h3>
            <p className="font-mono text-xs text-neutral-500">{item.year}</p>
          </div>
          <p className="text-[14px] leading-7 text-neutral-700">{item.degree}</p>
        </article>
      ))}
    </div>
  );
}
