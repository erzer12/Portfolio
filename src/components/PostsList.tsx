'use client';

import { useState } from 'react';

type Post = {
	id: string;
	title: string;
	description: string;
	date: string;
	readingTime: string;
	category: string;
	content: string[];
};

type PostsListProps = {
	posts: Post[];
};

export function PostsList({ posts }: PostsListProps) {
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);

	return (
		<div className="space-y-6">
			{/* Posts List */}
			<div className="flex flex-col gap-6">
				{posts.map((post) => (
					/* biome-ignore lint/a11y/useKeyWithClickEvents: open post details trigger */
					<article
						key={post.id}
						onClick={() => setSelectedPost(post)}
						className="group cursor-pointer p-5 bg-surface-container/30 hover:bg-surface-container border border-border-muted/50 hover:border-primary/45 rounded-xl transition-all duration-200"
					>
						<div className="flex justify-between items-center gap-4 mb-2">
							<span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-mono uppercase tracking-wider">
								{post.category}
							</span>
							<div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant/80">
								<span>{post.date}</span>
								<span>·</span>
								<span>{post.readingTime}</span>
							</div>
						</div>

						<h3 className="text-sm md:text-base font-bold text-on-surface group-hover:text-primary transition-colors mb-1.5 leading-snug">
							{post.title}
						</h3>

						<p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
							{post.description}
						</p>

						<div className="mt-3.5 flex items-center gap-1 text-[10px] font-mono text-primary group-hover:translate-x-0.5 transition-transform">
							<span>Read post</span>
							<span className="material-symbols-outlined text-[12px]">arrow_forward</span>
						</div>
					</article>
				))}
			</div>

			{/* Reading Modal */}
			{selectedPost && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-calm">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: close backdrop overlay */}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: close backdrop overlay */}
					<div onClick={() => setSelectedPost(null)} className="absolute inset-0 cursor-zoom-out" />
					<div className="relative w-full max-w-[650px] bg-surface-container border border-border-muted rounded-xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[85vh] z-10 space-y-6">
						{/* Close button */}
						<button
							type="button"
							onClick={() => setSelectedPost(null)}
							className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
						>
							<span className="material-symbols-outlined text-[20px]">close</span>
						</button>

						<div className="space-y-2">
							<span className="px-2.5 py-0.5 bg-primary/15 text-primary border border-primary/30 rounded text-[10px] font-mono uppercase tracking-wider inline-block">
								{selectedPost.category}
							</span>
							<h2 className="text-xl md:text-2xl font-bold text-on-surface leading-tight pr-4">
								{selectedPost.title}
							</h2>
							<div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant/80 border-b border-border-muted/30 pb-3">
								<span>{selectedPost.date}</span>
								<span>·</span>
								<span>{selectedPost.readingTime}</span>
							</div>
						</div>

						{/* Post Content */}
						<div className="space-y-4 text-xs md:text-sm text-on-surface-variant leading-relaxed">
							{selectedPost.content.map((paragraph, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: paragraphs list is static
								<p key={index}>{paragraph}</p>
							))}
						</div>

						<div className="pt-4 border-t border-border-muted/30 flex justify-end">
							<button
								type="button"
								onClick={() => setSelectedPost(null)}
								className="px-4 py-1.5 bg-surface-container-high border border-border-muted hover:bg-surface-container-highest font-mono rounded text-xs font-semibold text-on-surface transition-colors"
							>
								Close Reading
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
