import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { stringify } from "querystring";

// TODO define these somewhere else
var client_id = 'yourClientIDGoesHere';
var client_secret = 'YourSecretIDGoesHere';
var redirect_uri = 'http://localhost:3000/callback';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    var code = searchParams.get('code');
    var state = searchParams.get('state');

    if (state === null) {
        redirect('/#' +
            stringify({
                error: 'state_mismatch'
            }
        ));
    } else {
        try {
            const response = await fetch(
                'https://accounts.spotify.com/api/token',
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
                    },
                    body: JSON.stringify({
                        code: code,
                        redirect_uri: redirect_uri,
                        grant_type: 'authorization_code'
                    }),
                }
            )
            const json = await response.json()
            const access_token = json.body.access_token,
                refresh_token = json.body.refresh_token;

            const spotifyResponse = await fetch(
                'https://api.spotify.com/v1/me',
                {
                    headers: { 'Authorization': 'Bearer ' + access_token },
                }
            )
            console.log(spotifyResponse.body);

            redirect('/#' +
                stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                })
            );
        } catch (err) {
            redirect('/#' +
                stringify({
                    error: 'invalid_token'
                })
            );
        }
    }
}