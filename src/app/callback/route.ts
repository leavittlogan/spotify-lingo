import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { REDIRECT_URI } from '../consts';
import { cookies } from 'next/headers';

export async function GET (request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // TODO: check state param with the one generated at login
  if (state === null || code === null) {
    return {
        error: "Unable to authenticate to Spotify."
    }
  } else {
    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        body: new URLSearchParams({
          code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code'
        })
      }
    );

    const body = await response.json();

    const cookieStore = cookies();
    cookieStore.set('access_token', body.access_token, { maxAge: body.expires_in });
    cookieStore.set('refresh_token', body.refresh_token);

    // TODO: refresh_token endpoint

    redirect('/');
  }
}
