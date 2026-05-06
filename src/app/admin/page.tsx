export default function AdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-4 py-10 text-sm text-neutral-900">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
        <h1 className="mt-3 font-serif text-4xl italic">Structure shell</h1>
      </header>

      <section className="mt-10 space-y-4">
        <p className="leading-7 text-neutral-700">
          This page will hold the tabbed admin interface once the data layer and auth boundary are in place.
        </p>
      </section>
    </main>
  );
}
