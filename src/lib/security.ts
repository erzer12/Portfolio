/**
 * Security Utility Functions
 * For logging security events and managing authentication
 */

export interface SecurityEvent {
    type: 'login_attempt' | 'login_success' | 'login_failure' | 'session_expired' | 'unauthorized_access' | 'file_upload_attempt';
    timestamp: number;
    details?: Record<string, any>;
}

/**
 * Log security events (in production, send to monitoring service)
 */
export function logSecurityEvent(event: SecurityEvent) {
    const logEntry = {
        ...event,
        timestamp: new Date(event.timestamp).toISOString(),
    };

    // In development, just console log
    if (process.env.NODE_ENV === 'development') {
        console.warn('🔒 Security Event:', logEntry);
    }

    // In production, you would send to a logging service
    // Example: Send to Vercel Analytics, Sentry, or custom endpoint
    if (process.env.NODE_ENV === 'production') {
        // TODO: Implement production logging
        // fetch('/api/security-log', { method: 'POST', body: JSON.stringify(logEntry) });
    }
}

/**
 * Check if session is still valid
 */
export function isSessionValid(loginTimeStr: string | null): boolean {
    if (!loginTimeStr) return false;

    const loginTime = parseInt(loginTimeStr);
    const now = Date.now();
    const elapsed = now - loginTime;
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    return elapsed < SESSION_TIMEOUT;
}

/**
 * Update session activity timestamp
 */
export function updateSessionActivity() {
    if (typeof window !== 'undefined') {
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') {
            sessionStorage.setItem('admin_login_time', Date.now().toString());
        }
    }
}

/**
 * Clear admin session
 */
export function clearAdminSession() {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_auth');
        sessionStorage.removeItem('admin_login_time');

        logSecurityEvent({
            type: 'session_expired',
            timestamp: Date.now(),
        });
    }
}
