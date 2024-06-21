'use client';

import {VisualizationModel} from '@/app/frame-visualizer/types';
import {useEffect, useRef} from 'react';
import {useCanvas} from './hook';

export function VisualizationCanvas(props: VisualizationModel) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {drawImage, drawFrame} = useCanvas({canvas: canvasRef.current});

    useEffect(() => {
        if (props.image) {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const image = new Image();
                image.onload = () => {
                    drawImage(image, props.visualizationSize);
                    drawFrame(props.frames[0]);
                };
                image.src = event.target?.result as string;
            };
            reader.readAsDataURL(props.image);
        }
    }, [props.image, drawImage, drawFrame, props.frames, props.visualizationSize]);

    return (
        <>
            <canvas id={'canvas'} width={400} height={800} ref={canvasRef} className={'canvas'} />
            <a id={'link id'} style={{display: 'none'}}></a>
        </>
    );
}
