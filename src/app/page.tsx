import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-8">
        <section id="home" className="flex items-center justify-center">
          <h1 className="font-headline text-6xl">Home</h1>
        </section>
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
