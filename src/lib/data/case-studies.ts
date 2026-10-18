export type ArchitectureStep = {
	number: string;
	title: string;
	description: string;
	tech: string;
};

export type CaseStudy = {
	slug: string;
	title: string;
	tagline: string;
	category: string;
	date: string;
	status: 'Shipped' | 'Active' | 'Building';
	githubUrl: string;
	liveUrl: string;
	demoAvailabilityNote?: string;
	paperTitle?: string;
	paperVenue?: string;
	paperUrl?: string;
	overview: {
		problem: string;
		importance: string;
		solution: string;
		targetUsers: string;
	};
	contribution: {
		nature:
			| 'Solo Author & Builder'
			| 'Lead Frontend & Visualization Engineer'
			| 'Solo Developer & ML Engineer';
		summary: string;
		keyResponsibilities: string[];
		technicalDecisions: string[];
	};
	architecture: {
		diagramType: 'signstream' | 'hre' | 'zen';
		pipelineSummary: string;
		steps: ArchitectureStep[];
	};
	techStack: {
		category: string;
		items: string[];
	}[];
	results: {
		primaryMetric: string;
		primaryLabel: string;
		secondaryMetric?: string;
		secondaryLabel?: string;
		methodology: string;
		verifiedOutcomes: string[];
	};
	limitations: {
		tradeOffs: string[];
		futureRoadmap: string[];
	};
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
	signstream: {
		slug: 'signstream',
		title: 'SignStream — Real-Time Browser-Based Sign Language Recognition',
		tagline:
			'Client-side real-time American Sign Language recognition utilizing MediaPipe hand landmarks, a custom BiGRU classifier, and ONNX Runtime Web.',
		category: 'Computer Vision & Edge AI',
		date: 'March 2026',
		status: 'Shipped',
		githubUrl: 'https://github.com/erzer12/Signstream',
		liveUrl: 'https://signstream-psi.vercel.app',
		paperTitle:
			'SignStream: A Client-Side Real-Time Browser-Based Sign Language Recognition System',
		paperVenue:
			'NCMASE-26 (National Conference on Modern Advances in Software Engineering), March 2026',
		overview: {
			problem:
				'Traditional sign language recognition models rely on centralized cloud inference servers that require streaming high-definition video feeds across the network. This introduces severe privacy risks, bandwidth bottlenecks, and high infrastructure operating costs.',
			importance:
				'Real-time communication tools must be private, latency-resilient, and accessible to the Deaf and hard-of-hearing community without requiring expensive server subscriptions or transmitting intimate camera footage off-device.',
			solution:
				'SignStream executes the entire vision pipeline, landmark coordinate extraction, sequence buffering, and neural classification directly within the client browser via ONNX Runtime Web and WebGL/Wasm acceleration. Zero video frames or coordinate points ever leave the user device.',
			targetUsers:
				'Deaf and hard-of-hearing individuals, accessibility researchers, sign language learners, and web developers seeking private on-device assistive interfaces.',
		},
		contribution: {
			nature: 'Solo Author & Builder',
			summary:
				'Designed and implemented the complete end-to-end architecture, from model dataset curation and training in PyTorch to ONNX quantization, client-side inference engineering, and web application development.',
			keyResponsibilities: [
				'Curated and normalized 16-frame MediaPipe hand-landmark sequences for 129 vocabulary classes (WLASL top-100 sign phrases + 26 ASL alphabet letters and numerals).',
				'Architected and trained a 2-layer Bidirectional GRU (SignGRU) classifier with temporal dropout and batch normalization.',
				'Exported and quantized the PyTorch model into ONNX format, optimizing operator graphs for browser-based WebGL/Wasm inference engines.',
				'Built a responsive web client in React featuring real-time video landmark visualization, confidence smoothing, live caption streaming, and Web Speech API synthesis.',
			],
			technicalDecisions: [
				'Selected MediaPipe 21-point coordinate landmarks rather than full RGB CNN frames to reduce tensor dimensionality by >98%, enabling smooth 30 FPS client-side execution on modest hardware.',
				'Utilized a sliding 16-frame temporal buffer with exponential moving average probability smoothing to eliminate single-frame prediction flicker.',
			],
		},
		architecture: {
			diagramType: 'signstream',
			pipelineSummary:
				'End-to-end client-side pipeline: Camera Capture → Landmark Extraction → Sequence Buffer → Neural Classification → Live Captions & Speech.',
			steps: [
				{
					number: '01',
					title: 'Webcam Stream Capture',
					description:
						'Captures 30 FPS camera frames using navigator.mediaDevices with zero server transmission.',
					tech: 'HTML5 Video API',
				},
				{
					number: '02',
					title: 'MediaPipe Coordinate Extraction',
					description:
						'Computes 21 3D hand landmarks (x, y, z coordinates) normalized relative to wrist origin.',
					tech: 'MediaPipe Hands',
				},
				{
					number: '03',
					title: '16-Frame Temporal Buffer',
					description:
						'Sliding window accumulator that aggregates gesture velocity and trajectory over time.',
					tech: 'Circular Queue / ArrayBuffer',
				},
				{
					number: '04',
					title: 'SignGRU (BiGRU) Classifier',
					description:
						'Bidirectional recurrent network scoring probability distributions across 129 sign classes.',
					tech: 'PyTorch / ONNX',
				},
				{
					number: '05',
					title: 'ONNX Runtime Web Inference',
					description:
						'Compiles and executes graph tensors via WebGL shader pipelines or WebAssembly multi-threading.',
					tech: 'ONNX Runtime Web',
				},
				{
					number: '06',
					title: 'Real-Time Caption & Audio',
					description:
						'Filters low-confidence noise, updates the live UI text stream, and triggers optional text-to-speech.',
					tech: 'Web Speech API',
				},
			],
		},
		techStack: [
			{
				category: 'Machine Learning & Models',
				items: ['Python', 'PyTorch', 'ONNX', 'MediaPipe Hands', 'scikit-learn', 'NumPy'],
			},
			{
				category: 'Client-Side Web & Inference',
				items: [
					'ONNX Runtime Web',
					'React',
					'TypeScript',
					'Tailwind CSS',
					'Vite',
					'Web Speech API',
				],
			},
		],
		results: {
			primaryMetric: '97.2% ± 0.25%',
			primaryLabel: 'Top-1 Cross-Validation Accuracy',
			secondaryMetric: '~18ms',
			secondaryLabel: 'Average Client-Side Inference Latency',
			methodology:
				'Evaluated across 5-fold stratified cross-validation on 16-frame gesture sequences across a 129-class vocabulary (WLASL top-100 plus 26 ASL alphabet signs). Note: While cross-validation demonstrates strong classification of isolated and segmented gestures, real-world continuous signing involves co-articulation and movement transitions that require ongoing refinement.',
			verifiedOutcomes: [
				'Peer-reviewed paper accepted and presented at NCMASE-26 (March 2026).',
				'Sub-20ms inference latency on standard laptop hardware without GPU cloud dependencies.',
				'100% privacy compliance: no video or biometric telemetry ever exits the browser boundary.',
			],
		},
		limitations: {
			tradeOffs: [
				'Hand landmark tracking accuracy degrades under extreme low-light conditions or severe motion blur.',
				'Self-occlusion (one hand blocking another or fingers facing directly toward the lens) can temporarily destabilize coordinate detection.',
				'Current model vocabulary is limited to 129 common signs and alphabet glyphs rather than complete dictionary ASL.',
			],
			futureRoadmap: [
				'Integration of Connectionist Temporal Classification (CTC) for continuous sentence decoding.',
				'Two-handed spatial interaction modeling for complex bilateral signs.',
				'Client-side fine-tuning allowing users to calibrate personal signing style directly in local IndexedDB storage.',
			],
		},
	},

	'h-r-e': {
		slug: 'h-r-e',
		title: 'Historical Risk Explorer — NASA Space Apps Challenge 2025',
		tagline:
			'Interactive geospatial visualization platform analyzing multi-decadal NASA Earth observation data to assess regional climate and environmental hazard risk.',
		category: 'Geospatial Data Science & Visualization',
		date: 'October 2025',
		status: 'Shipped',
		githubUrl: 'https://github.com/erzer12/Nasa-hacthon',
		liveUrl: 'https://harshil-cloud-busters.share.connect.posit.cloud/',
		overview: {
			problem:
				'Environmental risk assessment demands synthesizing massive multi-decadal raster datasets (surface temperature anomalies, precipitation variance, vegetation indices). Traditional GIS toolchains require desktop software and steep learning curves, creating barriers for researchers and policymakers.',
			importance:
				'Timely, interactive visualization of historical climate anomalies is essential for identifying long-term geographic vulnerability patterns and preparing regional disaster-response strategies.',
			solution:
				'A lightweight, interactive web application developed for the NASA Earth Observation Challenge that enables users to query geographic bounding boxes, filter multi-year anomaly streams, and compute statistical risk scores on the fly.',
			targetUsers:
				'Environmental researchers, urban planners, regional disaster mitigation teams, and academic analysts exploring historical climate trends.',
		},
		contribution: {
			nature: 'Lead Frontend & Visualization Engineer',
			summary:
				'Led the interactive data visualization architecture and Streamlit dashboard implementation within a collaborative hackathon team, earning Global Nominee recognition.',
			keyResponsibilities: [
				'Designed and built the Streamlit interactive dashboard with real-time geospatial coordinate slicing and dynamic metric filters.',
				'Engineered optimized data caching and indexing mechanisms to accelerate query response times across multi-decade raster tables.',
				'Created interactive multi-layered Plotly choropleths and risk anomaly distribution charts.',
				'Collaborated with team data engineers on data cleaning, spatial bounding box calculations, and NASA submission presentation.',
			],
			technicalDecisions: [
				'Implemented columnar in-memory caching for aggregated spatial sectors rather than streaming uncompressed multi-gigabyte GeoTIFF files on every slider change.',
				'Constructed normalized composite hazard scoring to present complex multi-parameter indicators as unified, understandable risk indices.',
			],
		},
		architecture: {
			diagramType: 'hre',
			pipelineSummary:
				'Data ingestion and processing flow: NASA Earth Datasets → Spatial Preprocessing → Anomaly Indexing → Streamlit Filtering → Visual Map Stream.',
			steps: [
				{
					number: '01',
					title: 'NASA Earth Obs Ingestion',
					description:
						'Ingestion of historical surface temperature, precipitation, and vegetation anomaly datasets.',
					tech: 'NASA Open Data / NetCDF',
				},
				{
					number: '02',
					title: 'Spatial Clipping & Cleaning',
					description:
						'Spatial bounding box filtering, missing value imputation, and regional normalization.',
					tech: 'GeoPandas & NumPy',
				},
				{
					number: '03',
					title: 'Hazard Anomaly Engine',
					description:
						'Statistical deviation modeling calculating standard score deviations against historical baselines.',
					tech: 'Pandas & SciPy',
				},
				{
					number: '04',
					title: 'Streamlit Application Core',
					description:
						'Interactive UI controls managing spatial bounding, temporal ranges, and hazard weightings.',
					tech: 'Streamlit',
				},
				{
					number: '05',
					title: 'Interactive Visual Stream',
					description:
						'Dynamic geospatial heatmaps, trend lines, and downloadable risk assessment reports.',
					tech: 'Plotly / Streamlit',
				},
			],
		},
		techStack: [
			{
				category: 'Core Data & Analysis',
				items: ['Python', 'Pandas', 'NumPy', 'GeoPandas', 'SciPy'],
			},
			{
				category: 'Visualization & Interface',
				items: ['Streamlit', 'Plotly Express', 'Folium', 'Posit Cloud'],
			},
		],
		results: {
			primaryMetric: 'Global Nominee',
			primaryLabel: 'NASA Space Apps Challenge 2025 Honor',
			secondaryMetric: '~15%',
			secondaryLabel: 'Exploration Query Speedup',
			methodology:
				'The ~15% speedup in risk-exploration queries was measured on local test suites across 10 multi-decade queries comparing memory-cached partitioned data streams against raw multi-gigabyte raster scans.',
			verifiedOutcomes: [
				'Selected as Global Nominee among thousands of worldwide team submissions in NASA Space Apps 2025.',
				'Enabled intuitive multi-decade anomaly exploration in seconds without requiring GIS desktop workstations.',
				'Successfully hosted and deployed interactive public prototype on Posit Cloud.',
			],
		},
		limitations: {
			tradeOffs: [
				'The prototype uses pre-processed historical data snapshots rather than live daily satellite telemetry feeds.',
				'Spatial resolution is aggregated by regional bounding grids to preserve smooth browser interaction.',
			],
			futureRoadmap: [
				'Automated ingestion pipelines connecting directly to NASA Earthdata Cloud APIs.',
				'Integration of predictive machine learning models for short-term hazard forecasting.',
			],
		},
	},

	zen: {
		slug: 'zen',
		title: 'Zen — AI Mental Health Companion for Students',
		tagline:
			'An empathetic conversational support chatbot combining DistilRoBERTa emotion detection, RAG retrieval over 21 clinical psychology guides, and guided wellness exercises.',
		category: 'Generative AI & Conversational Systems',
		date: 'January 2026',
		status: 'Active',
		githubUrl: 'https://github.com/erzer12/Zen',
		liveUrl: 'https://huggingface.co/spaces/Erzer12/mental-health-companion',
		demoAvailabilityNote:
			'Hosted on Hugging Face Spaces (free tier). The application may sleep after periods of inactivity; please allow 30–60 seconds for the container to spin up if sleeping.',
		overview: {
			problem:
				'University students face high rates of academic anxiety, isolation, and burnout, while campus counseling centers frequently struggle with multi-week waiting lists. Off-the-shelf generalist chatbots frequently hallucinate, lack boundary guardrails, or offer ungrounded advice.',
			importance:
				'Student mental wellness support must be empathetic, non-judgmental, grounded in verified clinical psychological frameworks (CBT/mindfulness), and equipped with clear safety guardrails.',
			solution:
				'Zen combines fine-tuned emotion classification with retrieval-augmented generation (RAG) over 21 clinical psychology references, dynamically tailoring empathetic responses and suggesting actionable grounding exercises without pretending to replace human therapy.',
			targetUsers:
				'College and university students seeking immediate emotional grounding, study stress reduction, and structured mindfulness prompts.',
		},
		contribution: {
			nature: 'Solo Developer & ML Engineer',
			summary:
				'Engineered the complete conversational system, including clinical document ingestion, FAISS vector indexing, emotion detection routing, prompt guardrails, and Gradio deployment on Hugging Face.',
			keyResponsibilities: [
				'Curated and chunked 21 evidence-based clinical psychology reference guides covering CBT techniques, grounding protocols, and stress reduction.',
				'Implemented vector embeddings using Sentence Transformers (all-MiniLM-L6-v2) and built an in-memory FAISS similarity search index.',
				'Integrated j-hartmann/emotion-english-distilroberta-base to classify incoming messages across 7 emotion classes in real time.',
				'Designed dynamic prompt templates modulating empathy and suggestion tone based on detected emotional distress.',
				'Orchestrated Meta-Llama-3-8B-Instruct via the Hugging Face Inference API and deployed the Gradio interface.',
			],
			technicalDecisions: [
				'Separated emotion classification from text generation, allowing immediate detection of high-distress messages to trigger dedicated safety guardrails and hotline references.',
				'Used dense semantic retrieval (FAISS) over curated clinical guides to anchor LLM responses in verifiable psychological techniques rather than arbitrary generative hallucinations.',
			],
		},
		architecture: {
			diagramType: 'zen',
			pipelineSummary:
				'Conversational workflow: User Input → Emotion Classifier → FAISS Clinical Retrieval → Augmented Prompt → LLaMA-3 Generation → Grounded Empathetic Response.',
			steps: [
				{
					number: '01',
					title: 'User Input & Safety Check',
					description: 'Inbound message checked for immediate crisis signals and safety keywords.',
					tech: 'Gradio Interface',
				},
				{
					number: '02',
					title: 'Emotion Classification',
					description:
						'Assigns emotion probabilities (sadness, anxiety, anger, neutral) to guide response tone.',
					tech: 'DistilRoBERTa Emotion Model',
				},
				{
					number: '03',
					title: 'Clinical Knowledge Retrieval',
					description:
						'FAISS similarity search queries 21 indexed clinical guides for relevant CBT/grounding snippets.',
					tech: 'Sentence Transformers + FAISS',
				},
				{
					number: '04',
					title: 'Context-Augmented Prompting',
					description:
						'Combines conversation history, detected emotion state, and retrieved clinical evidence.',
					tech: 'Prompt Engineering Engine',
				},
				{
					number: '05',
					title: 'LLM Generation & Polish',
					description:
						'Generates empathetic, non-prescriptive supportive guidance with interactive wellness prompts.',
					tech: 'Meta-Llama-3-8B-Instruct',
				},
			],
		},
		techStack: [
			{
				category: 'Models & NLP',
				items: [
					'Meta-Llama-3-8B-Instruct',
					'DistilRoBERTa Emotion',
					'Sentence Transformers',
					'PyTorch',
				],
			},
			{
				category: 'Retrieval & Deployment',
				items: [
					'FAISS Vector Index',
					'Hugging Face Inference API',
					'Gradio',
					'Hugging Face Spaces',
				],
			},
		],
		results: {
			primaryMetric: '~5%',
			primaryLabel: 'Unsupported Response Rate (vs >24% baseline)',
			secondaryMetric: '21',
			secondaryLabel: 'Clinical CBT Reference Guides Indexed',
			methodology:
				'Evaluation was conducted using a test set of 100 standardized student stress scenarios evaluated against CBT clinical guidance criteria for factual consistency, empathetic tone, and boundary adherence. Grounded RAG reduced unsupported or speculative responses from >24% (ungrounded zero-shot) to ~5%.',
			verifiedOutcomes: [
				'Consistently grounds relaxation and coping suggestions in evidence-based clinical protocols.',
				'Real-time sub-50ms emotion detection enables tone-aware responses without lag.',
				'Publicly accessible on Hugging Face Spaces for students and evaluators.',
			],
		},
		limitations: {
			tradeOffs: [
				'Zen is explicitly a non-clinical wellness companion and not a licensed therapy or crisis intervention service.',
				'Free tier Hugging Face Spaces sleep during periods of inactivity, requiring cold boot initialization.',
				'Context window is bounded by the free inference API rate constraints.',
			],
			futureRoadmap: [
				'Local quantized model execution (e.g. WebLLM or local Ollama) for zero-latency offline interaction.',
				'Longitudinal mood tracking across sessions with privacy-first client-side encryption.',
			],
		},
	},
};

export function getCaseStudy(slug: string): CaseStudy | null {
	const normalized = slug.toLowerCase();
	if (normalized === 'signstream') return CASE_STUDIES.signstream;
	if (normalized === 'h-r-e' || normalized === 'historical-risk-explorer')
		return CASE_STUDIES['h-r-e'];
	if (normalized === 'zen') return CASE_STUDIES.zen;
	return null;
}
