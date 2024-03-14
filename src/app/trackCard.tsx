import styles from './page.module.css';
import Image from 'next/image';
import { hasJapanese, toRomaji } from './util';

export default async function TrackCard(props: { track: Track }) {
    let nameRomaji = "";
    if (hasJapanese(props.track.name)) {
        nameRomaji = await toRomaji(props.track.name)
    }

    return <a href={props.track.url}>
        <div className={styles.trackcard}>
            <Image
                src={props.track.images[1].url}
                alt="album art"
                height={props.track.images[1].height}
                width={props.track.images[1].width}
            />
            <div>
                <h1>
                    {props.track.name}
                </h1>
                <h2>
                    {nameRomaji}
                </h2>
            </div>
        </div>
    </a>
}