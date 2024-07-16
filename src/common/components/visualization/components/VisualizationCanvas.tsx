'use client';

import {useEffect, useRef} from 'react';
import {useCanvas} from './hook';
import {VisualizationModel} from '../../frame-form/types';
import classes from './Visualization.module.css';

export function VisualizationCanvas(props: VisualizationModel) {
    const linkId = 'link_id';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {drawImage, drawFrame, clear, save} = useCanvas({canvas: canvasRef.current});

    useEffect(() => {
        if (props.images.length) {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const image = new Image();
                image.onload = () => {
                    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
                    props.frames.forEach((frame, index) => {
                        delay(1000 * index).then(() => {
                            clear();
                            drawImage(image, props.visualizationSize, frame);
                            drawFrame(frame, props.visualizationSize);
                            delay(200).then(() => save(linkId, frame.frameId));
                        });
                    });
                };
                image.src = event.target?.result as string;
            };
            reader.readAsDataURL(props.images[0]);
        }
    }, [props.images, drawImage, drawFrame, props.frames, props.visualizationSize, clear, save]);

    return (
        <>
            <canvas id={'canvas'} width={1200} height={2400} ref={canvasRef} className={classes.visualization} />
            <a id={linkId} style={{display: 'none'}}></a>
        </>
    );
}
