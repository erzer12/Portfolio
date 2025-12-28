import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';

const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
    try {
        // Authentication check - require access code header
        const accessCode = request.headers.get('x-access-code');
        const correctCode = process.env.ADMIN_ACCESS_CODE;

        if (!correctCode) {
            console.error('ADMIN_ACCESS_CODE not configured');
            return NextResponse.json({
                success: false,
                message: 'Server misconfiguration'
            }, { status: 500 });
        }

        if (!accessCode || accessCode !== correctCode) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            }, { status: 401 });
        }

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({
                success: false,
                message: 'No file uploaded'
            }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json({
                success: false,
                message: `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}`
            }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                success: false,
                message: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create public/images directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public/images');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate secure unique filename with original extension
        const ext = path.extname(file.name).toLowerCase();
        const filename = `${randomUUID()}${ext}`;
        const filePath = path.join(uploadDir, filename);

        // Write file to filesystem
        await writeFile(filePath, buffer);

        if (process.env.NODE_ENV === 'development') {
            console.log(`File saved to ${filePath}`);
        }

        // Return the public URL
        return NextResponse.json({
            success: true,
            url: `/images/${filename}`,
            message: 'File uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
