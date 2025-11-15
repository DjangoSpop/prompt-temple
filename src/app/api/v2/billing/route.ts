import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/v2/billing
 * Fetch billing information (subscription, usage, credits, invoices)
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
    const endpoint = searchParams.get('endpoint') || 'subscription';

    // Support multiple billing endpoints
    const validEndpoints = ['subscription', 'usage', 'credits', 'invoices', 'payment-methods'];
    const targetEndpoint = validEndpoints.includes(endpoint) ? endpoint : 'subscription';

    const response = await fetch(
      `${BACKEND_URL}/api/v2/billing/${targetEndpoint}/`,
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
    console.error('Billing fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: 'Failed to fetch billing information' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v2/billing
 * Consume credits or update billing information
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

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'credits/consume';

    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/v2/billing/${endpoint}/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Billing operation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: 'Failed to process billing operation' },
      { status: 500 }
    );
  }
}
