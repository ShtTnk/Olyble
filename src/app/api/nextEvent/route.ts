import { fetchEvents } from '../../lib/scrapeLabola';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    const events = await fetchEvents();
    return NextResponse.json({ events });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

