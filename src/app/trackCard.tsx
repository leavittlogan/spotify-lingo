import styles from './page.module.css';
import Image from 'next/image';

export default function TrackCard(props: { track: Track }) {
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
                    (translated title)
                </h2>
            </div>
        </div>
    </a>
}