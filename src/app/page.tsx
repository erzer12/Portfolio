import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import ScrollAnimator from '@/components/scroll-animator';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-8">
        <ScrollAnimator as="section" id="home" className="flex flex-col items-start justify-center text-left">
            <p className="text-accent font-headline text-2xl md:text-3xl mb-4">Hi, my name is</p>
            <h1 className="text-5xl md:text-8xl font-bold font-headline glitch-text" data-text="Harshil P">
              Harshil P
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-muted-foreground mt-2 glitch-text" data-text="AI & Bot Enthusiast">
              AI & Bot Enthusiast
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
        <ScrollAnimator as="section" id="about" className="flex flex-col items-start justify-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-12 relative">
            <span className="text-accent">01.</span> About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-muted-foreground text-lg space-y-4">
              <p>
                Proficient in Python, prompt engineering, and generative AI. Passionate about tackling challenges and crafting meaningful, user-centric solutions.
              </p>
            </div>
            <div className="relative w-64 h-64 mx-auto">
               <div className="absolute inset-0 bg-accent/20 rounded-lg transform transition-transform duration-300 group-hover:rotate-6"></div>
                <Image
                  src="https://picsum.photos/256/256"
                  alt="Profile Picture"
                  width={256}
                  height={256}
                  className="rounded-lg object-cover relative z-10 w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                  data-ai-hint="portrait person"
                />
            </div>
          </div>
        </ScrollAnimator>
        <section id="skills" className="flex items-center justify-center">
          <h1 className="font-headline text-6xl">Skills</h1>
        </section>
        <section id="projects" className="flex items-center justify-center">
          <h1 className="font-headline text-6xl">Projects</h1>
        </section>
        <section id="contact" className="flex items-center justify-center">
          <h1 className="font-headline text-6xl">Contact</h1>
        </section>
      </main>
      <Footer />
    </div>
  );
}
