import { loginAction } from '@/app/actions';

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6B6B66]">Admin</p>
          <h1 className="mt-2 font-serif text-3xl italic text-[#1A1A18]">Sign in</h1>
          <p className="mt-1 font-mono text-xs text-[#6B6B66]">
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
              className="font-mono text-xs uppercase tracking-[0.14em] text-[#6B6B66]"
            >
              Access Code
            </label>
            <input
              id="code"
              name="code"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 block w-full border-b border-[#E4E4DF] bg-transparent py-2 font-mono text-sm text-[#1A1A18] outline-none transition-colors focus:border-[#1A1A18]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-[#1A1A18] py-2 font-mono text-xs uppercase tracking-[0.14em] text-[#1A1A18] transition-colors hover:bg-[#1A1A18] hover:text-[#FAFAF8]"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
