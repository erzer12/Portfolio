import Image from 'next/image';
import { Github, ExternalLink, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollAnimator from '@/components/scroll-animator';

const projects = [
  {
    title: 'Project One',
    description: 'A brief description of this cool project, highlighting the technologies used and its purpose. Built with React and Node.js.',
    image: 'https://picsum.photos/600/400',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Project Two',
    description: 'Another awesome project that showcases my skills in UI/UX design and frontend development using Next.js and Tailwind CSS.',
    image: 'https://picsum.photos/600/400?grayscale',
    tags: ['Next.js', 'Tailwind CSS', 'Figma'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Project Three',
    description: 'This project involved building a full-stack application with a focus on performance and scalability. Deployed on Vercel.',
    image: 'https://picsum.photos/600/400?blur=1',
    tags: ['SvelteKit', 'Go', 'GraphQL', 'Docker'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Project Four',
    description: 'An exploration of 3D graphics and animations on the web using Three.js and React Three Fiber.',
    image: 'https://picsum.photos/seed/picsum/600/400',
    tags: ['Three.js', 'React Three Fiber', 'Blender'],
    liveUrl: '#',
    githubUrl: '#',
  },
];

const skills = [
  'JavaScript (ES6+)',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'HTML & (S)CSS',
  'Tailwind CSS',
  'Figma',
  'Git & GitHub',
  'SQL & NoSQL',
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-8">
        <ScrollAnimator as="section" id="home" className="flex flex-col items-start justify-center text-left">
          <p className="text-accent font-headline text-2xl md:text-3xl mb-4">Hi, my name is</p>
          <h1 className="text-5xl md:text-8xl font-bold font-headline glitch-text" data-text="Your Name">
            Your Name
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold font-headline text-muted-foreground mt-2">I build things for the web.</h2>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg">
            I’m a software engineer specializing in building (and occasionally designing) exceptional digital experiences. Currently, I’m focused on building accessible, human-centered products.
          </p>
          <a href="#projects">
            <Button size="lg" className="mt-8 font-headline text-xl glitch-hover" data-text="View My Work">
              <span>View My Work</span>
            </Button>
          </a>
        </ScrollAnimator>

        <ScrollAnimator as="section" id="about" className="flex flex-col items-start justify-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 relative">
            <span className="text-accent">01.</span> About Me
          </h2>
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-3 text-muted-foreground text-lg space-y-4">
              <p>
                Hello! I'm a passionate software developer with a knack for creating dynamic and intuitive web applications. My journey into code began years ago, and since then, I've been captivated by the endless possibilities of technology.
              </p>
              <p>
                I thrive on turning complex problems into simple, beautiful, and functional solutions. My expertise lies in the MERN stack, but I'm always eager to learn new technologies and expand my skillset.
              </p>
              <p>
                When I'm not coding, you can find me exploring the great outdoors, contributing to open-source projects, or diving into a good sci-fi novel.
              </p>
            </div>
            <div className="md:col-span-2 flex items-center justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-lg transform transition-transform duration-300 group-hover:rotate-6"></div>
                <Image
                  src="https://picsum.photos/400/400"
                  alt="Your Name"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover relative z-10 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                  data-ai-hint="portrait person"
                />
              </div>
            </div>
          </div>
        </ScrollAnimator>
        
        <ScrollAnimator as="section" id="skills" className="flex flex-col items-start justify-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 relative">
            <span className="text-accent">02.</span> Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-lg font-body px-4 py-2 border-2 border-accent text-accent">
                {skill}
              </Badge>
            ))}
          </div>
        </ScrollAnimator>

        <ScrollAnimator as="section" id="projects" className="flex flex-col items-start justify-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 relative">
            <span className="text-accent">03.</span> Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent transition-all duration-300 group">
                <CardHeader>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="rounded-t-lg mb-4 object-cover"
                    data-ai-hint="technology abstract"
                  />
                  <CardTitle className="font-headline text-3xl flex justify-between items-center">
                    {project.title}
                    <div className="flex gap-2">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                        <Github size={24} />
                      </a>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">
                        <ExternalLink size={24} />
                      </a>
                    </div>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-body">{tag}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground/80">{project.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollAnimator>

        <ScrollAnimator as="section" id="contact" className="flex flex-col items-center justify-center text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4 relative"><span className="text-accent">04.</span> Get In Touch</h2>
          <p className="max-w-xl mx-auto text-muted-foreground mb-8">
            My inbox is always open. Whether you have a question or just want to say hi, I’ll try my best to get back to you! Feel free to reach out about opportunities or collaborations.
          </p>
          <a href="mailto:your.email@example.com">
            <Button size="lg" className="font-headline text-xl glitch-hover" data-text="Say Hello">
              <Mail className="mr-2 h-5 w-5" />
              <span>Say Hello</span>
            </Button>
          </a>
        </ScrollAnimator>
      </main>
      <Footer />
    </div>
  );
}
