'use client';

type Props = {
	type: 'signstream' | 'hre' | 'zen';
};

export function ProjectArchitectureDiagram({ type }: Props) {
	if (type === 'signstream') {
		return (
			<div className="w-full rounded-xl border border-surface0/80 bg-crust/80 p-5 sm:p-6 space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface0/60 pb-3">
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-peach" />
						<span className="text-xs font-mono font-bold text-text uppercase tracking-wider">
							System Architecture: Fully Client-Side ASL Inference
						</span>
					</div>
					<span className="text-[11px] font-mono text-green bg-green/10 border border-green/30 px-2 py-0.5 rounded">
						Zero Network Telemetry (100% Private)
					</span>
				</div>

				{/* Visual Flow Grid (Responsive Desktop horizontal, Mobile vertical) */}
				<div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative items-stretch">
					{/* Stage 1 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-accent font-bold">01 • INPUT</span>
							<span className="text-xs">📹</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Webcam Capture</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								navigator.mediaDevices @ 30 FPS video stream
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							HTML5 Video API
						</div>
					</div>

					{/* Stage 2 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-blue font-bold">02 • TRACK</span>
							<span className="text-xs">🖐</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Landmarks</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								21 3D points per frame (63 values) normalized
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							MediaPipe Hands
						</div>
					</div>

					{/* Stage 3 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-peach font-bold">03 • BUFFER</span>
							<span className="text-xs">⏱</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">16-Frame Buffer</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Sliding temporal window tracking trajectory
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							Circular ArrayBuffer
						</div>
					</div>

					{/* Stage 4 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-mauve font-bold">04 • CLASSIFY</span>
							<span className="text-xs">🧠</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">SignGRU (BiGRU)</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								2-layer Bidirectional GRU across 129 classes
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							PyTorch ➔ ONNX
						</div>
					</div>

					{/* Stage 5 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-green font-bold">05 • RUNTIME</span>
							<span className="text-xs">⚡</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">ONNX Web</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Client-side GPU shader acceleration (WebGL/Wasm)
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							ONNX Runtime Web
						</div>
					</div>

					{/* Stage 6 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-accent font-bold">06 • OUTPUT</span>
							<span className="text-xs">💬</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Captions & Audio</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Confidence filter + live caption buffer + TTS
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							Web Speech API
						</div>
					</div>
				</div>

				{/* Arrow Flow Diagram (SVG) */}
				<div className="hidden md:flex items-center justify-between px-6 text-xs text-subtext1 font-mono">
					<span>[Webcam 30 FPS]</span>
					<span className="text-accent">━━━━▶</span>
					<span>[21 Landmarks]</span>
					<span className="text-accent">━━━━▶</span>
					<span>[16 Frames]</span>
					<span className="text-accent">━━━━▶</span>
					<span>[BiGRU Inference]</span>
					<span className="text-accent">━━━━▶</span>
					<span>[18ms Latency]</span>
					<span className="text-accent">━━━━▶</span>
					<span>[Live ASL Captions]</span>
				</div>
			</div>
		);
	}

	if (type === 'hre') {
		return (
			<div className="w-full rounded-xl border border-surface0/80 bg-crust/80 p-5 sm:p-6 space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface0/60 pb-3">
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-blue" />
						<span className="text-xs font-mono font-bold text-text uppercase tracking-wider">
							System Architecture: Geospatial Analysis & Risk Modeling
						</span>
					</div>
					<span className="text-[11px] font-mono text-blue bg-blue/10 border border-blue/30 px-2 py-0.5 rounded">
						NASA Earth Observation Data Stream
					</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
					{/* Stage 1 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-blue font-bold">01 • INGEST</span>
							<span className="text-xs">🛰</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Earth Obs Data</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Multi-decadal historical surface temp & precipitation records
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							NASA Open Data / NetCDF
						</div>
					</div>

					{/* Stage 2 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-teal font-bold">02 • PREPROCESS</span>
							<span className="text-xs">📐</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Spatial Indexing</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Bounding box clipping, missing value imputation, normalization
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							GeoPandas & NumPy
						</div>
					</div>

					{/* Stage 3 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-peach font-bold">03 • RISK ENGINE</span>
							<span className="text-xs">📊</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Anomaly Scoring</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Statistical Z-score deviations against historical baselines
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							Pandas & SciPy
						</div>
					</div>

					{/* Stage 4 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-lavender font-bold">04 • CONTROLS</span>
							<span className="text-xs">🎛</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Interactive UI</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Dynamic temporal sliders, bounding box selectors, metrics
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							Streamlit Core
						</div>
					</div>

					{/* Stage 5 */}
					<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-green font-bold">05 • VISUALIZE</span>
							<span className="text-xs">🗺</span>
						</div>
						<div>
							<div className="font-mono text-xs font-bold text-text">Choropleth Stream</div>
							<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
								Real-time heatmaps, risk anomaly curves, and report export
							</div>
						</div>
						<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
							Plotly Express & Posit
						</div>
					</div>
				</div>

				<div className="hidden md:flex items-center justify-between px-6 text-xs text-subtext1 font-mono">
					<span>[Historical Datasets]</span>
					<span className="text-blue">━━━━▶</span>
					<span>[Spatial Partitioning]</span>
					<span className="text-blue">━━━━▶</span>
					<span>[Z-Score Risk Math]</span>
					<span className="text-blue">━━━━▶</span>
					<span>[Interactive Sliders]</span>
					<span className="text-blue">━━━━▶</span>
					<span>[15% Faster Query Stream]</span>
				</div>
			</div>
		);
	}

	// Zen Architecture
	return (
		<div className="w-full rounded-xl border border-surface0/80 bg-crust/80 p-5 sm:p-6 space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface0/60 pb-3">
				<div className="flex items-center gap-2">
					<span className="w-2.5 h-2.5 rounded-full bg-mauve" />
					<span className="text-xs font-mono font-bold text-text uppercase tracking-wider">
						System Architecture: Emotion-Grounded RAG Pipeline
					</span>
				</div>
				<span className="text-[11px] font-mono text-mauve bg-mauve/10 border border-mauve/30 px-2 py-0.5 rounded">
					21 Clinical Guides Indexed
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
				{/* Stage 1 */}
				<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-mono text-accent font-bold">01 • INPUT</span>
						<span className="text-xs">💬</span>
					</div>
					<div>
						<div className="font-mono text-xs font-bold text-text">Student Message</div>
						<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
							Inbound conversation text with safety checks
						</div>
					</div>
					<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
						Gradio Interface
					</div>
				</div>

				{/* Stage 2 */}
				<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-mono text-mauve font-bold">02 • EMOTION</span>
						<span className="text-xs">🎭</span>
					</div>
					<div>
						<div className="font-mono text-xs font-bold text-text">DistilRoBERTa</div>
						<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
							Assigns emotion class (sadness, anxiety, anger, calm)
						</div>
					</div>
					<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
						Sub-50ms Inference
					</div>
				</div>

				{/* Stage 3 */}
				<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-mono text-teal font-bold">03 • RETRIEVE</span>
						<span className="text-xs">📚</span>
					</div>
					<div>
						<div className="font-mono text-xs font-bold text-text">FAISS Vector Search</div>
						<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
							Dense semantic search over 21 clinical CBT guides
						</div>
					</div>
					<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
						all-MiniLM-L6-v2 + FAISS
					</div>
				</div>

				{/* Stage 4 */}
				<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-mono text-peach font-bold">04 • AUGMENT</span>
						<span className="text-xs">🧩</span>
					</div>
					<div>
						<div className="font-mono text-xs font-bold text-text">Context Assembly</div>
						<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
							Injects clinical grounding & safety guardrails into prompt
						</div>
					</div>
					<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
						Safe Prompt Templates
					</div>
				</div>

				{/* Stage 5 */}
				<div className="p-3.5 rounded-lg border border-surface1/60 bg-mantle flex flex-col justify-between space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-mono text-green font-bold">05 • GENERATE</span>
						<span className="text-xs">🌿</span>
					</div>
					<div>
						<div className="font-mono text-xs font-bold text-text">LLaMA-3-8B</div>
						<div className="text-[11px] font-sans text-subtext0 leading-tight mt-1">
							Evidence-grounded response + breathing & grounding prompts
						</div>
					</div>
					<div className="pt-1.5 border-t border-surface0/40 text-[10px] font-mono text-subtext1">
						HF Inference API
					</div>
				</div>
			</div>

			<div className="hidden md:flex items-center justify-between px-6 text-xs text-subtext1 font-mono">
				<span>[Student Message]</span>
				<span className="text-mauve">━━━━▶</span>
				<span>[Emotion Classification]</span>
				<span className="text-mauve">━━━━▶</span>
				<span>[21 Clinical PDFs FAISS]</span>
				<span className="text-mauve">━━━━▶</span>
				<span>[Guardrailed Prompt]</span>
				<span className="text-mauve">━━━━▶</span>
				<span>[~5% Hallucination Rate]</span>
			</div>
		</div>
	);
}
