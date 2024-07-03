'use client';
import React, {useState} from 'react';
import './styles.css';
import {VisualizationForm} from '@/common/components/frame-form/VisualizationForm';
import {VisualizationCanvas} from '@/common/components/visualization/components/Visualization';
import {VisualizationModel} from '@/common/components/frame-form/types';

export function Visualization() {
    const [model, setModel] = useState<VisualizationModel>({
        images: [],
        frames: [],
        visualizationSize: {
            width: 50,
            height: 50,
        },
    });

    return (
        <div className={'frame-selector'}>
            <VisualizationForm model={model} onChange={setModel} />
            <VisualizationCanvas {...model} />
        </div>
    );
}
