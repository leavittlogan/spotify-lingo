import { cookies } from 'next/headers';
import styles from './page.module.css';
import { redirect } from 'next/navigation';
import TrackCard from './trackCard';

async function fetchProfile(token: string): Promise<UserProfile> {
  const response = await fetch(
    'https://api.spotify.com/v1/me',
    {
      headers: { Authorization: 'Bearer ' + token }
    }
  );

  return await response.json();
}

async function fetchCurrentlyPlaying(token: string): Promise<Track | null> {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      headers: { Authorization: 'Bearer ' + token}
    }
  );

  // empty body response
  if (response.status == 204) {
    return null;
  }

  const data = await response.json();
  return {
    name: data.item.name,
    images: data.item.album.images,
    url: data.item.external_urls.spotify
  };
}

export default async function Home() {
  const access_token = cookies().get('access_token')?.value;
  if (!access_token) {
    redirect('/login');
  }

  const user_info = await fetchProfile(access_token);
  const currently_playing_track = await fetchCurrentlyPlaying(access_token)

  return (
    <main className={styles.main}>
      {currently_playing_track ?
        <TrackCard track={currently_playing_track}/>
        : <h1>No track playing</h1>
      }
    </main>
  );
}
