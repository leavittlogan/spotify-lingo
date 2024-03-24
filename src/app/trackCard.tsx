import Image from 'next/image';
import { hasJapanese, toRomaji } from '../utils/kuroshiro';
import { translateText } from '@/utils/cloudTranslation';

export default async function TrackCard(props: { track: Track }) {
    let nameRomaji = "";
    let nameTranslated = "";
    if (hasJapanese(props.track.name)) {
        [nameRomaji, nameTranslated] = await Promise.all([toRomaji(props.track.name), translateText(props.track.name)]);
    }

    return <a href={props.track.url}>
        <div className='flex flex-row my-8'>
            <Image className='rounded shadow-lg'
                src={props.track.album.images[1].url}
                alt="album art"
                height={props.track.album.images[1].height}
                width={props.track.album.images[1].width}
            />
            <div className='flex flex-col justify-end m-8'>
                <h1 className='font-black text-8xl'>
                    {props.track.name}
                </h1>
                <h2 className='font-normal text-6xl'>
                    {nameRomaji}
                </h2>
                <h3 className='font-normal text-5xl'>
                    {nameTranslated}
                </h3>
                <div>
                    <span className='font-normal'>{props.track.artists[0].name} </span>
                </div>
            </div>
        </div>
    </a>
}