import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/v2/gamification
 * Fetch user gamification profile (achievements, level, XP, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', detail: 'No authentication token provided' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'profile';

    // Support multiple gamification endpoints
    const validEndpoints = ['profile', 'achievements', 'leaderboard', 'progress', 'rewards'];
    const targetEndpoint = validEndpoints.includes(endpoint) ? endpoint : 'profile';

    const response = await fetch(
      `${BACKEND_URL}/api/v2/gamification/${targetEndpoint}/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Gamification fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: 'Failed to fetch gamification data' },
      { status: 500 }
    );
  }
}
