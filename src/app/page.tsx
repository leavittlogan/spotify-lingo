import { cookies } from 'next/headers';
import styles from './page.module.css';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function Home () {
  const access_token = cookies().get('access_token')?.value;
  if (!access_token) {
    redirect('/login');
  }

  const response = await fetch(
    'https://api.spotify.com/v1/me',
    {
      headers: { Authorization: 'Bearer ' + access_token }
    }
  );

  if (!response.ok) {
    console.log('failed to get spotify user info:', await response.json());
    return (
            <main className={styles.main}>
                <h2>
                    An error occurred
                </h2>
            </main>
    );
  }

  const user_info = await response.json();
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
