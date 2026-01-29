import { NextResponse } from 'next/server';

/**
 * API Route to fetch available Gemini models
 * Uses API_KEY_GEMINI from server-side .env (not exposed to browser)
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function GET() {
    try {
        const apiKey = process.env.API_KEY_GEMINI;

        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: 'API_KEY_GEMINI không được cấu hình' },
                { status: 500 }
            );
        }

        const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`);

        if (!response.ok) {
            throw new Error('Không thể kết nối Gemini API');
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            models: data.models || []
        });
    } catch (error) {
        console.error('Gemini models fetch error:', error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'Lỗi server' },
            { status: 500 }
        );
    }
}
