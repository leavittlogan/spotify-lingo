import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { stringify } from "querystring";
import { REDIRECT_URI } from "../consts";


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    var code = searchParams.get('code');
    var state = searchParams.get('state');
    
    // TODO check for error in params

    if (state === null || code === null) {
        redirect('/#' +
            stringify({
                error: 'invalid_callback_request'
            }
        ));
    } else {
        const response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
                },
                body: new URLSearchParams({
                    'code': code,
                    'redirect_uri': REDIRECT_URI,
                    'grant_type': 'authorization_code'
                }),
            }
        )
        if (!response.ok) {
            console.log('fetch failed:', await response.json())
            redirect('/#' +
                stringify({
                    error: 'authentication_failed'
                }
            ));
        }

        const body = await response.json()
        const access_token = body.access_token,
            refresh_token = body.refresh_token;

        // TODO: where to store access token? cookies?
        // TOOD: refresh_token endpoint

        const user_info_response = await fetch(
            'https://api.spotify.com/v1/me',
            {
                headers: { 'Authorization': 'Bearer ' + access_token },
            }
        )
        if (!user_info_response.ok) {
            console.log('failed to get spotify user info:', await user_info_response.json())
        }
        console.log(await user_info_response.json());

        redirect('/');
    }
}