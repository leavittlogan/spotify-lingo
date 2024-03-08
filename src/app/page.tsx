import { cookies } from 'next/headers';
import styles from './page.module.css';
import { redirect } from 'next/navigation';
import Image from 'next/image';

async function fetchProfile(token: string): Promise<UserProfile> {
  const response = await fetch(
    'https://api.spotify.com/v1/me',
    {
      headers: { Authorization: 'Bearer ' + token }
    }
  );

  return await response.json();
}

export default async function Home () {
  const access_token = cookies().get('access_token')?.value;
  if (!access_token) {
    redirect('/login');
  }

  const user_info = await fetchProfile(access_token);
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
        </div>
      </a>
    </main>
  );
}
