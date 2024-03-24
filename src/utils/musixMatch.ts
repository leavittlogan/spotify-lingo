
export default async function getLyrics(track: Track): Promise<string> {

    const response = await fetch('https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?' + new URLSearchParams({
        apikey: process.env.MUSIX_MATCH_API_KEY ?? "",
        q_artist: track.artists[0].name,
        q_track: track.name,
    }));

    const json = await response.json();

    // TODO: check if lyrics are empty
    return json.message.body.lyrics.lyrics_body;
}