import { getPageViewCountAction } from '@/app/actions';
import { getProfile } from '@/lib/data/profile';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

type LayoutWrapperProps = {
	children: React.ReactNode;
	showFooter?: boolean;
};

export async function LayoutWrapper({ children, showFooter = true }: LayoutWrapperProps) {
	const profile = await getProfile();
	const initialViews = await getPageViewCountAction();

	const resumeUrl = profile?.resume;
	const githubUrl = profile?.social?.github;
	const linkedinUrl = profile?.social?.linkedin;
	const email = profile?.email;

	return (
		<div className="min-h-screen flex flex-col bg-background text-on-surface transition-colors duration-300">
			<Navigation resumeUrl={resumeUrl} />

			<main className="flex-grow max-w-[1080px] w-full mx-auto pt-10 pb-16 animate-calm">
				{children}
			</main>

			{showFooter && (
				<Footer
					githubUrl={githubUrl}
					linkedinUrl={linkedinUrl}
					email={email}
					initialViews={initialViews}
				/>
			)}
		</div>
	);
}
