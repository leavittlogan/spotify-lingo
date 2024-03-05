import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { stringify } from 'querystring';
import { REDIRECT_URI } from '../consts';
import { cookies } from 'next/headers';

export async function GET (request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // TODO check for error in params

  if (state === null || code === null) {
    redirect('/#' +
      stringify({
        error: 'invalid_callback_request'
      })
    );
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
    if (!response.ok) {
      console.log('fetch failed:', await response.json());
      redirect('/#' +
        stringify({
          error: 'authentication_failed'
        })
      );
    }

    const body = await response.json();

    const cookieStore = cookies();
    cookieStore.set('access_token', body.access_token);
    cookieStore.set('refresh_token', body.refresh_token);

    // TOOD: refresh_token endpoint

    redirect('/');
  }
}
