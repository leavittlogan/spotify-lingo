import { cookies } from 'next/headers';
import Image from 'next/image';
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
    album: {
      images: data.item.album.images,
    },
    url: data.item.external_urls.spotify,
    artists: data.item.artists.map((item: { name: any; images: any; }) => {
      return {
        name: item.name,
      }
    })
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
    <main className='p-4 min-h-screen bg-gradient-to-b from-gray-800 to-black'>
      <div className='overflow-hidden'>
        <div className='flex justify-center items-center gap-2 p-2 float-right bg-black rounded-full'>
          <Image className='float-right rounded-full' 
            src={user_info.images[0].url}
            alt='profile picture'
            height={32}
            width={32}
          /> 
          <span className='font-semibold'>{user_info.display_name}</span>
        </div>
      </div>
      {currently_playing_track ?
        <TrackCard track={currently_playing_track}/>
        : <h1>No track playing</h1>
      }
    </main>
  );
}
