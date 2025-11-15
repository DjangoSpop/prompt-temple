import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/v2/workspace
 * Fetch user workspace conversations
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
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const search = searchParams.get('search') || '';

    const queryString = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    }).toString();

    const response = await fetch(
      `${BACKEND_URL}/api/v2/workspace/conversations/?${queryString}`,
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
    console.error('Workspace fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: 'Failed to fetch workspace' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v2/workspace
 * Save a new conversation to workspace
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', detail: 'No authentication token provided' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/v2/workspace/conversations/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Workspace save error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}
