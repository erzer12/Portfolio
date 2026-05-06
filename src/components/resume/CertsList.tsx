type CertsListProps = {
  items: Array<{
    name: string;
    issuer: string;
  }>;
};

export function CertsList({ items }: CertsListProps) {
  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item) => (
        <a
          key={item.name}
          href="#"
          className="flex items-center justify-between gap-4 px-0 py-3 text-[14px] text-neutral-800 transition-colors hover:bg-neutral-100"
        >
          <span>{item.name}</span>
          <span className="font-mono text-xs text-neutral-500">{item.issuer}</span>
        </a>
      ))}

      <button type="button" className="w-full py-3 font-mono text-xs text-neutral-500">
        + more
      </button>
    </div>
  );
}
