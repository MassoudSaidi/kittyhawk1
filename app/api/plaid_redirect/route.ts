import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const oauth_state_id = url.searchParams.get('oauth_state_id');

    console.log('OAuth state ID:', oauth_state_id);

    if (oauth_state_id) {
      const baseUrl = `${url.protocol}//${url.host}`;
      return NextResponse.redirect(`${baseUrl}/protected?oauth_state_id=${oauth_state_id}`);
    }

    return new NextResponse('Missing oauth_state_id', { status: 400 });
  } catch (error) {
    console.error('Redirect handler error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

