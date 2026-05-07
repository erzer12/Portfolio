import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getProfile } from '@/lib/data/profile';
import { getProjects } from '@/lib/data/projects';
import { getSkills } from '@/lib/data/skills';
import { getExperience } from '@/lib/data/experience';
import { getEducation } from '@/lib/data/education';
import { getCertifications } from '@/lib/data/certifications';
import { getAllTestimonials } from '@/lib/data/testimonials';
import { getSiteSettings } from '@/lib/data/settings';
import { AdminShell } from './_components/AdminShell';
import { logoutAction } from '@/app/actions';

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect('/admin/login');

  const [profile, projects, skills, experience, education, certifications, testimonials, settings] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getSkills(),
      getExperience(),
      getEducation(),
      getCertifications(),
      getAllTestimonials(),
      getSiteSettings(),
    ]);

  return (
    <main className="min-h-screen bg-[--bg]">
      <nav className="sticky top-0 z-10 border-b border-[--rule] bg-[--bg] px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[--ink-muted]">Admin · </span>
            <a href="/" className="font-serif text-lg italic text-[--ink]">HP.</a>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted] hover:text-[--ink]">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <AdminShell
          profile={profile}
          projects={projects}
          skills={skills}
          experience={experience}
          education={education}
          certifications={certifications}
          testimonials={testimonials}
          settings={settings}
        />
      </div>
    </main>
  );
}
