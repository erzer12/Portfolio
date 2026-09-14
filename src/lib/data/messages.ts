import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { ContactMessage } from '@/types';

export async function getContactMessages(): Promise<ContactMessage[]> {
	try {
		const { data, error } = await supabaseAdmin
			.from('contact_messages')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			if (error.code === 'PGRST205') {
				// Table does not exist yet in Supabase
				console.info(
					'Notice: "contact_messages" table not found in Supabase. Run migration in supabase/schema.sql to enable inbox storage.',
				);
				return [];
			}
			console.error('Error fetching contact messages:', error.message || error);
			return [];
		}

		return (data as ContactMessage[]) || [];
	} catch (err) {
		console.warn('Could not query contact_messages:', err);
		return [];
	}
}

export async function submitContactMessage(
	message: Pick<ContactMessage, 'name' | 'email' | 'message'>,
) {
	// Attempt insert via public client first, fallback to supabaseAdmin if needed
	const { error } = await supabase.from('contact_messages').insert({
		name: message.name,
		email: message.email,
		message: message.message,
		read: false,
	});

	if (error) {
		// Fallback to service role admin
		const { error: adminError } = await supabaseAdmin.from('contact_messages').insert({
			name: message.name,
			email: message.email,
			message: message.message,
			read: false,
		});
		if (adminError) throw adminError;
	}
}

export async function markContactMessageRead(id: string, read: boolean) {
	const { error } = await supabaseAdmin.from('contact_messages').update({ read }).eq('id', id);

	if (error) throw error;
}

export async function deleteContactMessage(id: string) {
	const { error } = await supabaseAdmin.from('contact_messages').delete().eq('id', id);

	if (error) throw error;
}
