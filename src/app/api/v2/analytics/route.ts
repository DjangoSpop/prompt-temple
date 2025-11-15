import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/v2/analytics
 * Fetch analytics data (usage, sessions, performance, reports)
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
    const endpoint = searchParams.get('endpoint') || 'usage';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Support multiple analytics endpoints
    const validEndpoints = ['usage', 'sessions', 'performance', 'reports'];
    const targetEndpoint = validEndpoints.includes(endpoint) ? endpoint : 'usage';

    const queryParams = new URLSearchParams();
    if (from) queryParams.append('from', from);
    if (to) queryParams.append('to', to);

    const queryString = queryParams.toString();
    const url = `${BACKEND_URL}/api/v2/analytics/${targetEndpoint}/${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
