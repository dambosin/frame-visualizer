'use client';
import React, {useState} from 'react';
import './styles.css';
import {useFrames} from './hooks';
import {VisualizationForm} from '@/common/components/frame-form/VisualizationForm';
import {VisualizationCanvas} from '@/common/components/visualization/components/Visualization';
import {VisualizationModel} from '@/common/components/frame-form/types';

export function Visualization() {
    const [model, setModel] = useState<VisualizationModel>({
        frames: [],
        visualizationSize: {
            width: 50,
            height: 50,
        },
    });
    const frameOptions = useFrames();

    return (
        <div className={'frame-selector'}>
            <VisualizationForm frameOptions={frameOptions} visualizationSize={model.visualizationSize} onSubmit={setModel} />
            <VisualizationCanvas {...model} />
        </div>
    );
}
