import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const TOKEN_SALT = 'portfolio-admin-session-v1';

export function getExpectedAdminToken(): string {
	const adminCode = process.env.ADMIN_ACCESS_CODE;
	if (!adminCode) return '';
	return createHmac('sha256', adminCode).update(TOKEN_SALT).digest('hex');
}

export async function requireAdminAuth() {
	const cookieStore = await cookies();
	const token = cookieStore.get('admin_token')?.value;
	const expected = getExpectedAdminToken();

	if (!token || !expected) {
		throw new Error('Unauthorized');
	}

	const tokenBuf = Buffer.from(token, 'utf8');
	const expectedBuf = Buffer.from(expected, 'utf8');

	if (tokenBuf.length !== expectedBuf.length || !timingSafeEqual(tokenBuf, expectedBuf)) {
		throw new Error('Unauthorized');
	}
}

export async function isAdminAuthenticated(): Promise<boolean> {
	try {
		await requireAdminAuth();
		return true;
	} catch {
		return false;
	}
}
