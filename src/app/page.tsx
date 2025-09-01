

import { getDocs, collection, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import ScrollAnimator from '@/components/scroll-animator';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Bot, TerminalSquare } from 'lucide-react';
import ProjectCarousel from '@/components/project-carousel';
import ContactForm from '@/components/contact-form';
import AdminPanel from '@/components/admin-panel';

const iconMap = {
  BrainCircuit: <BrainCircuit size={40} className="text-primary" />,
  Bot: <Bot size={40} className="text-primary" />,
  TerminalSquare: <TerminalSquare size={40} className="text-primary" />,
};

async function getSkills() {
  try {
    const skillsCollection = collection(db, 'skills');
    const skillsSnapshot = await getDocs(skillsCollection);
    const skillsList = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return skillsList.map(skill => ({
      ...skill,
      icon: iconMap[skill.icon as keyof typeof iconMap] || <BrainCircuit size={40} className="text-primary" />
    }));
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

async function getProjects() {
  try {
    const projectsCollection = collection(db, 'projects');
    const q = orderBy('order', 'asc');
    const projectsSnapshot = await getDocs(projectsCollection);
    const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     // Simple sort if order is not consistent
    projectsList.sort((a, b) => (a.order || 99) - (b.order || 99));
    return projectsList;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  const skills = await getSkills();
  const projects = await getProjects();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminPanel skills={skills} projects={projects} />
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-8">
        <ScrollAnimator as="section" id="home" className="flex flex-col items-center justify-center text-center">
            <p className="text-primary font-headline text-2xl md:text-3xl mb-4">Hi, my name is</p>
            <h1 className="text-5xl md:text-8xl font-bold font-headline glitch-text" data-text="Harshil P">
              Harshil P
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-muted-foreground mt-2 glitch-text" data-text="AI & ml enthusiast">
              AI & ml enthusiast
            </h2>
            <p className="mt-6 max-w-xl text-muted-foreground text-lg">
              Enthusiastic Computer Science undergraduate dedicated to software development, with a focus on app creation, web scraping, bot development, and AI-driven tools.
            </p>
            <a href="#projects">
              <Button size="lg" className="mt-8 font-headline text-xl glitch-hover" data-text="View My Work">
                  <span>View My Work</span>
              </Button>
            </a>
        </ScrollAnimator>

        <ScrollAnimator as="section" id="about" className="flex flex-col items-center justify-center text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-12 relative">
            <span className="text-primary">01.</span> About Me
          </h2>
          <div className="flex flex-col items-center gap-12">
            <div className="max-w-3xl text-muted-foreground text-lg space-y-4 text-center">
              <p>
                Proficient in Python, prompt engineering, and generative AI. Passionate about tackling challenges and crafting meaningful, user-centric solutions.
              </p>
               <p>
                My journey into the world of AI began with a simple curiosity for how machines learn, which has since evolved into a deep-seated passion for developing intelligent systems that can understand and interact with the world in a meaningful way. I'm particularly interested in the applications of natural language processing and computer vision to solve real-world problems.
              </p>
              <p>
                When I'm not at my computer, I'm usually found exploring the latest in AI research, experimenting with new bot frameworks, or contributing to open-source projects.
              </p>
            </div>
            <div className="relative w-64 h-80 mx-auto group">
              <div className="absolute inset-0 bg-primary/20 rounded-lg transform transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105"></div>
              <div className="relative z-10 w-full h-full rounded-lg overflow-hidden">
                 <Image
                  src="/harshil_image.jpg"
                  alt="Profile Picture"
                  width={256}
                  height={320}
                  className="object-cover w-full h-full shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 backdrop-blur-[2px] rounded-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center text-sm">
                  A passionate developer with a love for creating innovative and user-friendly applications.
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimator>

        <ScrollAnimator as="section" id="skills" className="flex flex-col items-center justify-center text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-12 relative">
            <span className="text-primary">02.</span> Technical Skills
          </h2>
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {skills.map((category) => (
                <Card key={category.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group flex flex-col">
                  <CardHeader className="items-center text-center">
                    {category.icon}
                    <CardTitle className="font-headline text-3xl mt-4">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {category.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="font-body text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No skills to display. Add some in the admin panel (Ctrl+Shift+A).</p>
          )}
        </ScrollAnimator>

        <section id="projects" className="flex flex-col items-center justify-center w-full overflow-hidden text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-12 relative container mx-auto px-4 md:px-8">
            <span className="text-primary">03.</span> Projects
          </h2>
          {projects.length > 0 ? (
            <ProjectCarousel projects={projects} />
          ) : (
            <p className="text-muted-foreground">No projects to display. Add some in the admin panel (Ctrl+Shift+A).</p>
          )}
        </section>


        <ScrollAnimator as="section" id="contact" className="flex flex-col items-center justify-center text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4 relative">
            <span className="text-primary">04.</span> What's Next?
          </h2>
          <h3 className="font-headline text-5xl md:text-7xl font-bold mb-8">Get In Touch</h3>
          <p className="max-w-xl mx-auto text-muted-foreground mb-8">
            I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          <div className="w-full max-w-2xl">
            <ContactForm />
          </div>
        </ScrollAnimator>
      </main>
      <Footer />
    </div>
  );
}
