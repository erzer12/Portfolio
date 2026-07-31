'use client';

type GitHubContributionHeatmapProps = {
	username?: string;
};

export function GitHubContributionHeatmap({
	username = 'erzer12',
}: GitHubContributionHeatmapProps) {
	return (
		<div className="bg-surface-container rounded-xl border border-border-muted p-5 flex flex-col justify-between sm:col-span-2 min-h-[14rem] transition-colors duration-300 w-full">
			{/* Header Bar */}
			<div className="flex justify-between items-center mb-3">
				<div className="flex items-center gap-2">
					<span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
					<h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-semibold">
						884 contributions in the last year
					</h3>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-[9px] font-mono text-on-surface-variant/80 uppercase">
						@{username}
					</span>
					<a
						href={`https://github.com/${username}`}
						target="_blank"
						rel="noopener noreferrer"
						className="font-mono text-[9px] text-primary hover:underline hover:underline-offset-4 flex items-center gap-1"
					>
						<span>Profile</span>
						<span className="material-symbols-outlined text-[10px]">open_in_new</span>
					</a>
				</div>
			</div>

			{/* Contribution Calendar Heatmap Grid SVG */}
			<div className="flex-grow flex flex-col justify-center space-y-3 py-1">
				<div className="w-full overflow-x-auto rounded-lg border border-border-muted/40 p-3 bg-[#0d1117] flex justify-center items-center no-scrollbar min-h-[120px]">
					{/* biome-ignore lint/performance/noImgElement: ghchart real GitHub contribution calendar heatmap SVG */}
					<img
						src={`https://ghchart.rshah.org/27c93f/${username}`}
						alt={`GitHub Contribution Calendar Heatmap Grid for ${username}`}
						className="w-full max-w-full h-auto min-w-[600px] object-contain filter drop-shadow-sm"
						loading="lazy"
					/>
				</div>

				{/* Footer Meta: Less/More Key & Organization Badges */}
				<div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-muted/20 text-[10px] font-mono text-on-surface-variant">
					{/* Heatmap Legend */}
					<div className="flex items-center gap-1.5 text-[9px]">
						<span className="opacity-70">Less</span>
						<span className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-[#30363d]" />
						<span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]" />
						<span className="w-2.5 h-2.5 rounded-sm bg-[#006d32]" />
						<span className="w-2.5 h-2.5 rounded-sm bg-[#26a641]" />
						<span className="w-2.5 h-2.5 rounded-sm bg-[#39d353]" />
						<span className="opacity-70">More</span>
					</div>

					{/* Org Badges */}
					<div className="flex items-center gap-2 flex-wrap text-[9px]">
						<span className="px-2 py-0.5 rounded-full bg-surface-container-high border border-border-muted/50 text-on-surface flex items-center gap-1">
							<span className="w-1.5 h-1.5 rounded-full bg-[#89b4fa]" />
							@gtech-mulearn
						</span>
						<span className="px-2 py-0.5 rounded-full bg-surface-container-high border border-border-muted/50 text-on-surface flex items-center gap-1">
							<span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]" />
							@inovus-labs
						</span>
						<span className="px-2 py-0.5 rounded-full bg-surface-container-high border border-border-muted/50 text-on-surface flex items-center gap-1">
							<span className="w-1.5 h-1.5 rounded-full bg-[#cba6f7]" />
							@The-Purple-Movement
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
