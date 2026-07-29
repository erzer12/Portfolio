import { LayoutWrapper } from '@/components/LayoutWrapper';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { getProjects } from '@/lib/data/projects';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
	const projects = await getProjects();

	return (
		<LayoutWrapper>
			<div className="py-4">
				<ProjectsGrid projects={projects} />
			</div>
		</LayoutWrapper>
	);
}
