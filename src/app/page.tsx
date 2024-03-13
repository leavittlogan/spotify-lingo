import { cookies } from 'next/headers';
import styles from './page.module.css';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { toRomaji, hasJapanese } from './util';

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
  return { name: data.item.name };
}

export default async function Home() {
  const access_token = cookies().get('access_token')?.value;
  if (!access_token) {
    redirect('/login');
  }

  const user_info = await fetchProfile(access_token);
  const currently_playing_track = await fetchCurrentlyPlaying(access_token);
  const trackTitleString = currently_playing_track ? currently_playing_track.name : "-";
  let trackTitleRomaji = "";
  if (hasJapanese(trackTitleString)) {
    trackTitleRomaji = await toRomaji(trackTitleString)
  }
  const pic = user_info.images[1];

  return (
    <main className={styles.main}>
      <h1>Spotify Lingo</h1>
      <a href={user_info.external_urls.spotify}>
        <div className={styles.card}>
          <Image
            src={pic.url}
            alt="Profile Picture"
            height={pic.height}
            width={pic.width}
          />
          <h2>
            {user_info.display_name}
          </h2>
          <h3>
            {trackTitleString}
          </h3>
          <h4>
            {trackTitleRomaji}
          </h4>
        </div>
      </a>
    </main>
  );
}
