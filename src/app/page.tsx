import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import ScrollAnimator from '@/components/scroll-animator';

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
        <section id="about" className="flex items-center justify-center">
          <h1 className="font-headline text-6xl">About</h1>
        </section>
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
