import type React from 'react';

type SectionLabelProps = {
	children: React.ReactNode;
	id?: string;
};

export function SectionLabel({ children, id }: SectionLabelProps) {
	return (
		<h2
			id={id}
			className="font-mono text-base sm:text-lg font-bold text-text flex items-center gap-2"
		>
			<span className="text-accent select-none">{'//'}</span>
			<span>{children}</span>
		</h2>
	);
}
