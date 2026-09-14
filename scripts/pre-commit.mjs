import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';

// ANSI color helpers
const c = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	cyan: '\x1b[36m',
	magenta: '\x1b[35m',
};

const run = (cmd, silent = false) => {
	try {
		return execSync(cmd, { stdio: silent ? 'pipe' : 'inherit', encoding: 'utf8' });
	} catch (err) {
		if (silent) return null;
		throw err;
	}
};

const capture = (cmd) => {
	try {
		return execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
	} catch {
		return '';
	}
};

function printBanner() {
	console.log(`\n${c.cyan}┌────────────────────────────────────────────────────────┐${c.reset}`);
	console.log(`${c.cyan}│${c.reset}  ${c.bold}⚡ PORTFOLIO PRE-COMMIT VERIFICATION PIPELINE${c.reset}         ${c.cyan}│${c.reset}`);
	console.log(`${c.cyan}└────────────────────────────────────────────────────────┘${c.reset}\n`);
}

function checkStagedFiles() {
	const staged = capture('git diff --cached --name-only --diff-filter=ACMR');
	if (!staged) {
		console.log(`${c.yellow}ℹ No staged changes found to verify.${c.reset}`);
		process.exit(0);
	}
	return staged.split('\n').map((s) => s.trim()).filter(Boolean);
}

// ─── GATE 1: Staged Format & Lint with Biome ──────────────────────────────
function gateLintStaged() {
	process.stdout.write(`${c.bold}[1/4]${c.reset} 🎨 ${c.cyan}Biome staged formatting & linting...${c.reset} `);
	try {
		run('bunx lint-staged', true);
		console.log(`${c.green}✔ PASS${c.reset}`);
	} catch {
		console.log(`${c.red}✖ FAIL${c.reset}`);
		console.error(`\n${c.red}Biome encountered errors on staged files.${c.reset}`);
		console.error(`${c.dim}Run 'bun run check:fix' to auto-resolve.${c.reset}\n`);
		process.exit(1);
	}
}

// ─── GATE 2: Full TypeScript Type Check ────────────────────────────────────
function gateTypeCheck() {
	process.stdout.write(`${c.bold}[2/4]${c.reset} 🧠 ${c.cyan}TypeScript compilation check (tsc)...${c.reset} `);
	try {
		run('bun run typecheck', true);
		console.log(`${c.green}✔ PASS${c.reset}`);
	} catch {
		console.log(`${c.red}✖ FAIL${c.reset}`);
		console.error(`\n${c.red}TypeScript found compilation or type errors.${c.reset}`);
		console.error(`${c.dim}Run 'bun run typecheck' to see full compiler diagnostics.${c.reset}\n`);
		process.exit(1);
	}
}

// ─── GATE 3: Security & Secret Leak Guard ─────────────────────────────────
function gateSecurity(stagedFiles) {
	process.stdout.write(`${c.bold}[3/4]${c.reset} 🔐 ${c.cyan}Security & secret leak audit...${c.reset} `);

	// 1. Check for sensitive files
	const forbiddenFiles = ['.env', '.env.local', '.env.production', '.env.development'];
	const leakedFiles = stagedFiles.filter((f) => forbiddenFiles.some((bad) => f.endsWith(bad)));

	if (leakedFiles.length > 0) {
		console.log(`${c.red}✖ BLOCKED${c.reset}`);
		console.error(`\n${c.red}🚫 Prevented commit of sensitive environment file(s):${c.reset}`);
		for (const file of leakedFiles) {
			console.error(`   ${c.yellow}• ${file}${c.reset}`);
		}
		console.error(`${c.dim}Run 'git reset ${leakedFiles.join(' ')}' to unstage.${c.reset}\n`);
		process.exit(1);
	}

	// 2. Scan added lines in staged diff for credentials / keys
	const diff = capture("git diff --cached -U0 -- ':!.husky' ':!bun.lock' ':!package-lock.json'");
	const secretPatterns = [
		{ name: 'Private Key', regex: /-----BEGIN (?:RSA|EC|OPENSSH|PRIVATE) KEY/ },
		{ name: 'Resend API Key', regex: /re_[a-zA-Z0-9_]{20,}/ },
		{ name: 'Supabase Secret / JWT', regex: /eyJhbGciOi[a-zA-Z0-9_-]{20,}/ },
		{ name: 'GitHub Personal Token', regex: /(?:ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})/ },
		{ name: 'Discord Webhook URL', regex: /discord\.com\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+/ },
	];

	const addedLines = diff
		.split('\n')
		.filter((line) => line.startsWith('+') && !line.startsWith('+++'));

	for (const line of addedLines) {
		for (const pattern of secretPatterns) {
			if (pattern.regex.test(line)) {
				console.log(`${c.red}✖ BLOCKED${c.reset}`);
				console.error(`\n${c.red}🚨 Detected possible credential leak [${pattern.name}]:${c.reset}`);
				console.error(`   ${c.dim}${line.slice(0, 100)}...${c.reset}`);
				console.error(`${c.yellow}Move credentials into .env.local and use process.env instead.${c.reset}\n`);
				process.exit(1);
			}
		}
	}

	console.log(`${c.green}✔ PASS${c.reset}`);
}

// ─── GATE 4: Code Hygiene & Sanity Checks ──────────────────────────────────
function gateHygiene(stagedFiles) {
	process.stdout.write(`${c.bold}[4/4]${c.reset} 🧹 ${c.cyan}Code hygiene & git sanity checks...${c.reset} `);

	// 1. Check file size limits (reject any file > 2MB)
	const MAX_SIZE_MB = 2;
	for (const file of stagedFiles) {
		try {
			const stats = statSync(file);
			if (stats.size > MAX_SIZE_MB * 1024 * 1024) {
				console.log(`${c.red}✖ BLOCKED${c.reset}`);
				console.error(`\n${c.red}📦 File exceeds ${MAX_SIZE_MB}MB limit:${c.reset} ${file} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
				console.error(`${c.dim}Large binaries slow down git repos. Use Git LFS or external CDN.${c.reset}\n`);
				process.exit(1);
			}
		} catch {
			// File might be deleted, skip
		}
	}

	// 2. Check for merge conflict markers and stray debuggers
	const diff = capture("git diff --cached -U0 -- ':!.husky' ':!*.md' ':!bun.lock' ':!package-lock.json'");
	const addedLines = diff
		.split('\n')
		.filter((line) => line.startsWith('+') && !line.startsWith('+++'));

	for (const line of addedLines) {
		if (line.includes('<<<<<<< HEAD') || line.includes('>>>>>>>') || line === '+=======') {
			console.log(`${c.red}✖ BLOCKED${c.reset}`);
			console.error(`\n${c.red}⚔️  Unresolved merge conflict markers found in staged changes.${c.reset}`);
			console.error(`   ${c.yellow}${line}${c.reset}\n`);
			process.exit(1);
		}

		if (/\bdebugger\s*;?/.test(line)) {
			console.log(`${c.red}✖ BLOCKED${c.reset}`);
			console.error(`\n${c.red}🛑 Stray 'debugger;' statement found in staged changes:${c.reset}`);
			console.error(`   ${c.yellow}${line}${c.reset}\n`);
			process.exit(1);
		}
	}

	console.log(`${c.green}✔ PASS${c.reset}`);
}

// ─── Main Execution ────────────────────────────────────────────────────────
function main() {
	printBanner();
	const stagedFiles = checkStagedFiles();
	gateLintStaged();
	gateTypeCheck();
	gateSecurity(stagedFiles);
	gateHygiene(stagedFiles);

	console.log(`\n${c.green}✨ All pre-commit gates passed! Commit proceeding...${c.reset}\n`);
}

main();
