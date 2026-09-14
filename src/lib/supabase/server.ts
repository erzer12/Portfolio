import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
	if (!_admin) {
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
		if (!url || !key || key === 'your-service-role-key-here' || key.startsWith('your-')) {
			throw new Error(
				'Invalid SUPABASE_SERVICE_ROLE_KEY in .env.local (still set to placeholder). Please add your Supabase service_role secret key from Supabase Dashboard → Settings → API.',
			);
		}
		_admin = createClient(url, key, { auth: { persistSession: false } });
	}
	return _admin;
}

// Server-only client — uses service role key. Never expose to the browser.
export const supabaseAdmin = {
	from: (...args: Parameters<SupabaseClient['from']>) => getSupabaseAdmin().from(...args),
};
