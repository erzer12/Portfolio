

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import ScrollAnimator from '@/components/scroll-animator';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Github, ExternalLink, Mail, BrainCircuit, Bot, TerminalSquare } from 'lucide-react';
import ProjectCarousel from '@/components/project-carousel';
import ContactForm from '@/components/contact-form';

const skillCategories = [
  {
    title: 'AI & Machine Learning',
    icon: <BrainCircuit size={40} className="text-primary" />,
    skills: ['Python', 'Generative AI', 'Prompt Engineering', 'TensorFlow', 'Scikit-learn']
  },
  {
    title: 'Backend & Bot Development',
    icon: <Bot size={40} className="text-primary" />,
    skills: ['Flask', 'MongoDB', 'API Integration', 'Bot Development']
  },
  {
    title: 'Tools & Deployment',
    icon: <TerminalSquare size={40} className="text-primary" />,
    skills: ['GitHub', 'Discord.py', 'Cloud Deployment']
  }
];

const projects = [
  {
    title: 'Newshunt - AI-Powered Discord Bot',
    description: 'Developed a modular Discord bot for international and local news with user-customized preferences and language translation.',
    image: 'https://picsum.photos/600/400',
    tags: ['Discord.py', 'GPT-4', 'Flask', 'MongoDB'],
    github: '#',
    live: '#',
    aiHint: 'news bot abstract'
  },
  {
    title: 'Project Two',
    description: 'Another awesome project that showcases my skills in UI/UX design and frontend development using Next.js and Tailwind CSS.',
    image: 'https://picsum.photos/600/400?grayscale',
    tags: ['Next.js', 'Tailwind CSS', 'Figma'],
    github: '#',
    live: '#',
    aiHint: 'technology abstract'
  },
  {
    title: 'Project Three',
    description: 'This project involved building a full-stack application with a focus on performance and scalability. Deployed on Vercel.',
    image: 'https://picsum.photos/600/400?blur=1',
    tags: ['SvelteKit', 'Go', 'GraphQL', 'Docker'],
    github: '#',
    live: '#',
    aiHint: 'technology abstract'
  },
  {
    title: 'Project Four',
    description: 'An exploration of 3D graphics and animations on the web using Three.js and React Three Fiber.',
    image: 'https://picsum.photos/seed/picsum/600/400',
    tags: ['Three.js', 'React Three Fiber', 'Blender'],
    github: '#',
    live: '#',
    aiHint: 'technology abstract'
  },
   {
    title: 'Project Five',
    description: 'A brief description of this cool project, highlighting the technologies used and its purpose. Built with React and Node.js.',
    image: 'https://picsum.photos/600/400',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    github: '#',
    live: '#',
    aiHint: 'technology abstract'
  },
  {
    title: 'Project Six',
    description: 'Another awesome project that showcases my skills in UI/UX design and frontend development using Next.js and Tailwind CSS.',
    image: 'https://picsum.photos/600/400?grayscale',
    tags: ['Next.js', 'Tailwind CSS', 'Figma'],
    github: '#',
    live: '#',
    aiHint: 'technology abstract'
  },
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
          <div className="grid md:grid-cols-5 gap-16 items-center">
            <div className="md:col-span-3 text-muted-foreground text-lg space-y-4 text-center md:text-left">
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
            <div className="md:col-span-2 relative w-64 h-80 mx-auto group">
              <div className="absolute inset-0 bg-primary/20 rounded-lg transform transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105"></div>
              <div className="relative z-10 w-full h-full">
                <Image
                  src="https://storage.googleapis.com/project-3987932328827914946-files/d67e7616-52c6-430c-ab5c-60ff86903828"
                  alt="Profile Picture"
                  width={256}
                  height={320}
                  className="rounded-lg object-cover w-full h-full shadow-xl transition-opacity duration-300 group-hover:opacity-0"
                  unoptimized
                />
                <Image
                  src="https://picsum.photos/256/320"
                  alt="Hover Profile Picture"
                  width={256}
                  height={320}
                  data-ai-hint="fun portrait"
                  className="absolute inset-0 rounded-lg object-cover w-full h-full shadow-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </div>
          </div>
        </ScrollAnimator>

        <ScrollAnimator as="section" id="skills" className="flex flex-col items-center justify-center text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-12 relative">
            <span className="text-primary">02.</span> Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {skillCategories.map((category) => (
              <Card key={category.title} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group flex flex-col">
                <CardHeader className="items-center text-center">
                  {category.icon}
                  <CardTitle className="font-headline text-3xl mt-4">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="font-body text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollAnimator>

        <section id="projects" className="flex flex-col items-center justify-center w-full overflow-hidden text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-12 relative container mx-auto px-4 md:px-8">
            <span className="text-primary">03.</span> Projects
          </h2>
          <ProjectCarousel projects={projects} />
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
