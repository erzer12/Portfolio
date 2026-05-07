import { loginAction } from '@/app/actions';

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[--bg] px-4">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[--ink-muted]">Admin</p>
          <h1 className="mt-2 font-serif text-3xl italic text-[--ink]">Sign in</h1>
          <p className="mt-1 font-mono text-xs text-[--ink-muted]">
            Enter your access code to continue.
          </p>
        </div>

        {error && (
          <p className="font-mono text-xs text-red-600">Invalid access code. Try again.</p>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted]"
            >
              Access Code
            </label>
            <input
              id="code"
              name="code"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 block w-full border-b border-[--rule] bg-transparent py-2 font-mono text-sm text-[--ink] outline-none transition-colors focus:border-[--ink]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-[--ink] py-2 font-mono text-xs uppercase tracking-[0.14em] text-[--ink] transition-colors hover:bg-[--ink] hover:text-[--bg]"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
