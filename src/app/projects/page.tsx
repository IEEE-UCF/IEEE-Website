import ProjectsPage from '@/components/pg/projectspage';

import { Metadata } from 'next';

const pageTitle = 'Projects | IEEE UCF';
const pageDescription =
	'Explore IEEE UCF projects to tackle real-world challenges, build technical skills, and collaborate with peers.';

export const metadata: Metadata = {
	title: pageTitle,
	description: pageDescription,
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: 'https://www.ieeeucf.com/projects',
		type: 'website',
	},
};

export default function Projects() {
	return (
		<div>
			<ProjectsPage />
		</div>
	);
}
