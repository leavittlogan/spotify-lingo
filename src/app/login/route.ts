import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import { stringify } from 'querystring';
import { cookies } from 'next/headers';

import { REDIRECT_URI } from '../consts';

const generateRandomString = (length: number): string => {
  return randomBytes(60)
    .toString('hex')
    .slice(0, length);
};

export async function GET (request: Request) {
  const state = generateRandomString(16);
  cookies().set('spotify_auth_state', state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';
  redirect('https://accounts.spotify.com/authorize?' +
    stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI,
      state
    })
  );
}
