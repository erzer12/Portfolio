'use client';

import {
	Award,
	Briefcase,
	Code2,
	ExternalLink,
	FolderGit2,
	GraduationCap,
	Inbox,
	Link2,
	LogOut,
	Menu,
	MessageSquare,
	Sparkles,
	Trophy,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { logoutAction } from '@/app/actions';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

import type {
	Achievement,
	Certification,
	ContactMessage,
	Education,
	Experience,
	FooterLink,
	Profile,
	Project,
	SiteSettings,
	Skill,
	Testimonial,
} from '@/types';
import { AchievementsTab } from './AchievementsTab';
import { CertificationsTab } from './CertificationsTab';
import { EducationTab } from './EducationTab';
import { ExperienceTab } from './ExperienceTab';
import { FooterLinksTab } from './FooterLinksTab';
import { MessagesTab } from './MessagesTab';
import { ProfileTab } from './ProfileTab';
import { ProjectsTab } from './ProjectsTab';
import { SkillsTab } from './SkillsTab';
import { TestimonialsTab } from './TestimonialsTab';

export const TABS = [
	'Profile',
	'Projects',
	'Experience',
	'Skills',
	'Education',
	'Certifications',
	'Achievements',
	'Messages',
	'Testimonials',
	'Footer Links',
] as const;

export type Tab = (typeof TABS)[number];

type Props = {
	profile: Profile | null;
	projects: Project[];
	skills: Skill[];
	experience: Experience[];
	education: Education[];
	certifications: Certification[];
	achievements: Achievement[];
	testimonials: Testimonial[];
	settings: SiteSettings;
	footerLinks: FooterLink[];
	messages: ContactMessage[];
};

export function AdminShell({
	profile,
	projects,
	skills,
	experience,
	education,
	certifications,
	achievements,
	testimonials,
	settings,
	footerLinks,
	messages,
}: Props) {
	const [activeTab, setActiveTab] = useState<Tab>('Profile');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const unreadMessagesCount = messages ? messages.filter((m) => !m.read).length : 0;

	const NAV_SECTIONS = [
		{
			group: 'Overview',
			items: [{ id: 'Profile' as Tab, label: 'Profile & Bio', icon: User, count: null }],
		},
		{
			group: 'Portfolio Content',
			items: [
				{
					id: 'Projects' as Tab,
					label: 'Projects',
					icon: FolderGit2,
					count: projects?.length ?? 0,
				},
				{
					id: 'Experience' as Tab,
					label: 'Experience',
					icon: Briefcase,
					count: experience?.length ?? 0,
				},
				{
					id: 'Skills' as Tab,
					label: 'Skills Stack',
					icon: Code2,
					count: skills?.length ?? 0,
				},
			],
		},
		{
			group: 'Credentials',
			items: [
				{
					id: 'Education' as Tab,
					label: 'Education',
					icon: GraduationCap,
					count: education?.length ?? 0,
				},
				{
					id: 'Certifications' as Tab,
					label: 'Certificates',
					icon: Award,
					count: certifications?.length ?? 0,
				},
				{
					id: 'Achievements' as Tab,
					label: 'Achievements',
					icon: Trophy,
					count: achievements?.length ?? 0,
				},
			],
		},
		{
			group: 'Engagement & System',
			items: [
				{
					id: 'Messages' as Tab,
					label: 'Inbox Messages',
					icon: Inbox,
					count: unreadMessagesCount > 0 ? unreadMessagesCount : null,
					badgeVariant: unreadMessagesCount > 0 ? 'accent' : 'subtle',
				},
				{
					id: 'Testimonials' as Tab,
					label: 'Testimonials',
					icon: MessageSquare,
					count: testimonials?.length ?? 0,
				},
				{
					id: 'Footer Links' as Tab,
					label: 'Footer Links',
					icon: Link2,
					count: footerLinks?.length ?? 0,
				},
			],
		},
	];

	const TAB_DESCRIPTIONS: Record<Tab, { title: string; subtitle: string }> = {
		Profile: {
			title: 'Personal & Profile Information',
			subtitle:
				'Edit your public identity, bio tagline, contact coordinates, and resume download link.',
		},
		Projects: {
			title: 'Projects & Case Studies',
			subtitle:
				'Manage production apps, experiments, tech stacks, live links, and media for dedicated project pages.',
		},
		Experience: {
			title: 'Professional Experience & Roles',
			subtitle:
				'Add positions, employment history, bullet point accomplishments, and relevant technologies.',
		},
		Skills: {
			title: 'Skills & Technical Proficiencies',
			subtitle:
				'Organize tech capabilities, frameworks, and programming languages into clean categories.',
		},
		Education: {
			title: 'Academic Education & Degrees',
			subtitle: 'Manage universities, degrees, academic timelines, and highlights.',
		},
		Certifications: {
			title: 'Professional Certifications',
			subtitle:
				'Track industry certificates, credentials, issuing organizations, and verification links.',
		},
		Achievements: {
			title: 'Honors & Recognitions',
			subtitle:
				'Showcase hackathon achievements, NASA Space Apps nominations, and competitive awards.',
		},
		Messages: {
			title: 'Contact Form Inbox',
			subtitle:
				'View incoming messages from your portfolio contact form, track status, and respond.',
		},
		Testimonials: {
			title: 'Endorsements & Testimonials',
			subtitle: 'Review feedback, peer recommendations, and manage client testimonials visibility.',
		},
		'Footer Links': {
			title: 'External Navigation & Footer Links',
			subtitle:
				'Organize categorized social networks, repositories, and documentation links in the footer dock.',
		},
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-base text-text">
			{/* Mobile Top Header */}
			<div className="md:hidden flex items-center justify-between border-b border-surface0/80 bg-mantle px-4 py-3 sticky top-0 z-30">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-1.5 rounded-lg border border-surface0 text-subtext0 hover:text-text hover:bg-surface0/40"
					>
						{sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</button>
					<span className="font-bold text-sm tracking-tight text-accent">CMS Console</span>
				</div>
				<div className="flex items-center gap-2">
					<ThemeToggle showLabel={false} />
					<Link
						href="/"
						target="_blank"
						className="inline-flex items-center gap-1 text-xs text-subtext0 hover:text-accent"
					>
						<span>Site</span>
						<ExternalLink className="w-3 h-3" />
					</Link>
				</div>
			</div>

			{/* Left Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-40 w-64 md:w-72 bg-mantle border-r border-surface0/80 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				{/* Top Branding */}
				<div className="p-5 border-b border-surface0/80 space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-fg font-bold text-xs">
								HP
							</span>
							<span className="font-bold text-sm tracking-tight text-text">Control Center</span>
						</div>
						<span className="flex items-center gap-1.5 text-[10px] text-green border border-green/30 bg-green/10 px-2 py-0.5 rounded-full font-semibold">
							<span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
							Online
						</span>
					</div>

					<div className="flex items-center justify-between text-xs text-subtext0 pt-1">
						<Link
							href="/"
							className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline transition-colors"
						>
							<span>View Public Site</span>
							<ExternalLink className="w-3 h-3" />
						</Link>
						<span className="text-[11px] text-surface2">v2.4</span>
					</div>
				</div>

				{/* Nav Menu Groups */}
				<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
					{NAV_SECTIONS.map((section) => (
						<div key={section.group} className="space-y-1">
							<h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-subtext0/60">
								{section.group}
							</h3>
							<div className="space-y-0.5 pt-1">
								{section.items.map((item) => {
									const Icon = item.icon;
									const isActive = activeTab === item.id;
									return (
										<button
											key={item.id}
											type="button"
											onClick={() => {
												setActiveTab(item.id);
												setSidebarOpen(false);
											}}
											className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
												isActive
													? 'bg-surface0/90 text-accent font-bold shadow-sm border border-surface1/60'
													: 'text-subtext0 hover:text-text hover:bg-surface0/30'
											}`}
										>
											<div className="flex items-center gap-2.5">
												<Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-subtext0'}`} />
												<span>{item.label}</span>
											</div>

											{item.count !== null && item.count !== undefined && (
												<span
													className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
														item.badgeVariant === 'accent'
															? 'bg-accent text-accent-fg font-bold animate-bounce'
															: isActive
																? 'bg-surface1 text-text'
																: 'bg-surface0/60 text-subtext0'
													}`}
												>
													{item.count}
												</span>
											)}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</nav>

				{/* Sidebar Footer */}
				<div className="p-4 border-t border-surface0/80 bg-crust/50 flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 overflow-hidden">
						<div className="w-8 h-8 rounded-full bg-surface0 border border-surface1 flex items-center justify-center text-xs font-bold text-accent shrink-0">
							HP
						</div>
						<div className="truncate text-left">
							<p className="text-xs font-bold text-text truncate">
								{profile?.name || 'Administrator'}
							</p>
							<p className="text-[10px] text-subtext0 truncate">Connected via Supabase</p>
						</div>
					</div>

					<form action={logoutAction}>
						<button
							type="submit"
							title="Sign out"
							className="p-2 rounded-lg border border-surface0 hover:border-red/40 text-subtext0 hover:text-red hover:bg-red/10 transition-colors"
						>
							<LogOut className="w-4 h-4" />
						</button>
					</form>
				</div>
			</aside>

			{/* Backdrop for mobile */}
			{sidebarOpen && (
				<button
					type="button"
					aria-label="Close sidebar backdrop"
					onClick={() => setSidebarOpen(false)}
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden cursor-default"
				/>
			)}

			{/* Main Content Workspace */}
			<div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
				{/* Top workspace header banner */}
				<header className="border-b border-surface0/80 bg-mantle/60 backdrop-blur-sm px-6 py-6 sm:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20">
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-xs text-subtext0 font-mono">
							<span>Admin CMS</span>
							<span className="text-surface2">/</span>
							<span className="text-accent font-semibold">{activeTab}</span>
						</div>
						<h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
							{TAB_DESCRIPTIONS[activeTab]?.title || activeTab}
						</h1>
						<p className="text-xs text-subtext0 font-sans max-w-2xl leading-relaxed">
							{TAB_DESCRIPTIONS[activeTab]?.subtitle}
						</p>
					</div>

					<div className="flex items-center gap-2.5 self-start sm:self-center">
						<ThemeToggle />
						<span className="inline-flex items-center gap-1.5 rounded-xl border border-surface0 bg-surface0/40 px-3 py-1.5 text-xs text-subtext0">
							<Sparkles className="w-3.5 h-3.5 text-accent" />
							<span>Instant Sync</span>
						</span>
					</div>
				</header>

				{/* Tab content area */}
				<main className="flex-1 p-6 sm:p-10 max-w-6xl w-full mx-auto">
					<div className="rounded-2xl border border-surface0/80 bg-mantle/70 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
						{activeTab === 'Profile' && <ProfileTab profile={profile} />}
						{activeTab === 'Projects' && <ProjectsTab projects={projects} />}
						{activeTab === 'Experience' && <ExperienceTab experience={experience} />}
						{activeTab === 'Skills' && <SkillsTab skills={skills} />}
						{activeTab === 'Education' && <EducationTab education={education} />}
						{activeTab === 'Certifications' && (
							<CertificationsTab certifications={certifications} />
						)}
						{activeTab === 'Achievements' && <AchievementsTab achievements={achievements} />}
						{activeTab === 'Messages' && <MessagesTab messages={messages} />}
						{activeTab === 'Testimonials' && (
							<TestimonialsTab testimonials={testimonials} settings={settings} />
						)}
						{activeTab === 'Footer Links' && <FooterLinksTab links={footerLinks} />}
					</div>
				</main>
			</div>
		</div>
	);
}
