import { redirect } from 'next/navigation'
import { randomBytes } from 'crypto';
import { stringify } from 'querystring';
import { cookies } from 'next/headers';

var client_id = 'yourClientIDGoesHere';
var client_secret = 'YourSecretIDGoesHere';
var redirect_uri = 'http://localhost:3000/callback';

const generateRandomString = (length: number): string => {
    return randomBytes(60)
        .toString('hex')
        .slice(0, length);
}

var spotifyAuthStateKey = 'spotify_auth_state';
 
export async function GET(request: Request) {
    var state = generateRandomString(16);
    cookies().set(spotifyAuthStateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    redirect('https://accounts.spotify.com/authorize?' +
    stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
}