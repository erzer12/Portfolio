import { cookies } from 'next/headers';

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || token !== process.env.ADMIN_ACCESS_CODE) {
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
