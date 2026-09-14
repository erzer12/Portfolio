import { Braces } from 'lucide-react';
import {
	SiFlask,
	SiGooglegemini,
	SiHuggingface,
	SiNextdotjs,
	SiOnnx,
	SiPython,
	SiPytorch,
	SiReact,
	SiTensorflow,
} from 'react-icons/si';

/*
  Project card — final

  A single, complete card component: Instrument Serif italic title,
  Space Grotesk for everything else, a top bar colored by status in
  place of a dot. Stack is shown as a wrapped row of tag pills, each
  with a real brand icon where one exists (react-icons/si) and a
  generic fallback glyph (lucide-react) where it doesn't — so an
  unrecognized stack name never breaks, it just renders plainer.
  Light/dark via --pc-* variables (auto by system preference, or force
  with data-theme="dark" / "light" on any ancestor).

  Install: npm install react-icons lucide-react

  Usage:
    <ProjectCardStyles />   // once per page
    <ProjectCard
      title="Zen"
      blurb="A retrieval-augmented generation pipeline over a local document set."
      status="Building"
      stack={["FAISS", "Sentence Transformers", "Llama-3-8B"]}
      href="https://github.com/erzer12/zen"
    />

  Fonts (add once, e.g. in your global CSS or <head>):
    https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Space+Grotesk:wght@400;500&display=swap
*/

const STACK_ICONS = {
	python: SiPython,
	react: SiReact,
	'next.js': SiNextdotjs,
	nextjs: SiNextdotjs,
	tensorflow: SiTensorflow,
	pytorch: SiPytorch,
	flask: SiFlask,
	'sentence transformers': SiHuggingface,
	huggingface: SiHuggingface,
	onnx: SiOnnx,
	'onnx runtime web': SiOnnx,
	gemini: SiGooglegemini,
};

function stackIcon(name) {
	return STACK_ICONS[name.toLowerCase()] || Braces;
}

function ProjectCardStyles() {
	return (
		<style>{`
      :root {
        --pc-bg: #F7F7F5;
        --pc-surface: #FFFFFF;
        --pc-surface-hover: #FCFCFB;
        --pc-line: #E3E2DD;
        --pc-line-hover: #C7C5BD;
        --pc-text: #17181B;
        --pc-text-dim: #6B6E74;
        --pc-accent-building: #B08A3E;
        --pc-accent-active: #4C7A5A;
        --pc-accent-shipped: #4C6E96;
      }

      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          --pc-bg: #101114;
          --pc-surface: #17181C;
          --pc-surface-hover: #1C1E22;
          --pc-line: #26282D;
          --pc-line-hover: #383B42;
          --pc-text: #ECEDEF;
          --pc-text-dim: #9A9DA3;
          --pc-accent-building: #D6B872;
          --pc-accent-active: #8FBC9E;
          --pc-accent-shipped: #8FADD6;
        }
      }

      [data-theme="dark"] {
        --pc-bg: #101114;
        --pc-surface: #17181C;
        --pc-surface-hover: #1C1E22;
        --pc-line: #26282D;
        --pc-line-hover: #383B42;
        --pc-text: #ECEDEF;
        --pc-text-dim: #9A9DA3;
        --pc-accent-building: #D6B872;
        --pc-accent-active: #8FBC9E;
        --pc-accent-shipped: #8FADD6;
      }

      .pc-card {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 480px;
        text-decoration: none;
        background: var(--pc-surface);
        border: 1px solid var(--pc-line);
        border-top: 4px solid var(--pc-card-accent, var(--pc-line));
        border-radius: 8px;
        padding: 32px 32px 26px;
        transition: border-color 140ms ease, background-color 140ms ease;
      }

      .pc-card:hover,
      .pc-card:focus-visible {
        border-color: var(--pc-line-hover);
        border-top-color: var(--pc-card-accent, var(--pc-line-hover));
        background: var(--pc-surface-hover);
      }

      .pc-card:focus-visible {
        outline: 2px solid var(--pc-text-dim);
        outline-offset: 2px;
      }

      .pc-title {
        font-family: 'Instrument Serif', Georgia, serif;
        font-style: italic;
        font-weight: 400;
        font-size: 38px;
        line-height: 1.15;
        color: var(--pc-text);
        margin: 0 0 14px;
      }

      .pc-blurb {
        font-family: 'Space Grotesk', system-ui, sans-serif;
        font-size: 15.5px;
        line-height: 1.6;
        color: var(--pc-text-dim);
        margin: 0 0 26px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex-grow: 1;
      }

      .pc-foot {
        padding-top: 18px;
        border-top: 1px solid var(--pc-line);
      }

      .pc-status {
        display: block;
        font-family: 'Space Grotesk', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: var(--pc-card-accent, var(--pc-text-dim));
        margin-bottom: 12px;
      }

      .pc-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .pc-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 11px;
        border: 1px solid var(--pc-line);
        border-radius: 999px;
        font-family: 'Space Grotesk', system-ui, sans-serif;
        font-size: 12px;
        color: var(--pc-text-dim);
        line-height: 1;
      }

      .pc-tag svg {
        width: 13px;
        height: 13px;
        flex-shrink: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .pc-card {
          transition: none;
        }
      }
    `}</style>
	);
}

const STATUS_VAR = {
	building: 'var(--pc-accent-building)',
	active: 'var(--pc-accent-active)',
	shipped: 'var(--pc-accent-shipped)',
};

/**
 * @param {{
 *   title: string,
 *   blurb: string,
 *   status: "Building" | "Active" | "Shipped",
 *   stack: string[],
 *   href?: string,
 * }} props
 */
function ProjectCard({ title, blurb, status, stack, href }) {
	const accent = STATUS_VAR[status.toLowerCase()] || 'var(--pc-text-dim)';
	const external = href && href !== '#';

	return (
		<a
			href={href || '#'}
			className="pc-card"
			style={{ '--pc-card-accent': accent }}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			aria-label={`${title} — ${status}`}
		>
			<h3 className="pc-title">{title}</h3>
			<p className="pc-blurb">{blurb}</p>
			<div className="pc-foot">
				<span className="pc-status">{status}</span>
				<div className="pc-tags">
					{stack.map((tech) => {
						const Icon = stackIcon(tech);
						return (
							<span className="pc-tag" key={tech}>
								<Icon aria-hidden="true" />
								{tech}
							</span>
						);
					})}
				</div>
			</div>
		</a>
	);
}

export default function ProjectCardDemo() {
	return (
		<div style={{ background: 'var(--pc-bg)', padding: '40px' }}>
			<ProjectCardStyles />
			<ProjectCard
				title="Zen"
				blurb="A retrieval-augmented generation pipeline over a local document set."
				status="Building"
				stack={['FAISS', 'Sentence Transformers', 'Llama-3-8B']}
				href="#"
			/>
		</div>
	);
}

export { ProjectCard, ProjectCardStyles };
