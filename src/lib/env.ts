/**
 * Environment Variable Validation
 * Validates required environment variables at application startup
 */

const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

const optionalEnvVars = [
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'RESEND_API_KEY', // Only needed for contact form email
] as const;

export function validateEnv() {
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    // Check optional variables
    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(envVar);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
            `Please check your .env.local file and ensure all required variables are set.`
        );
    }

    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn(
            `⚠️  Optional environment variables not set:\n${warnings.map(v => `  - ${v}`).join('\n')}`
        );
    }

    return true;
}

// Auto-validate in development
if (process.env.NODE_ENV !== 'production') {
    validateEnv();
}
