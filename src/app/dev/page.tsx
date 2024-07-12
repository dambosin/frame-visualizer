'use client';
import {useFrames} from '@/common/pages/visualization/hooks';
import classes from './page.module.css';
import {MemoizedFrameCard} from '@/common/components/frame-card/FrameCard';

export default function Page() {
    const frames = useFrames();
    return (
        <div className={classes.page}>
            {frames.map((frame) => (
                <MemoizedFrameCard key={frame.frameId} img={frame.image} price={frame.price} />
            ))}
        </div>
    );
}
