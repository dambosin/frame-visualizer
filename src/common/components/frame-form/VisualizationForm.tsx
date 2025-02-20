'use-client';
import React from 'react';
import {FrameSelect} from './inputs/FrameSelect';
import './VisualizationForm.css';
import {MemoizedFileInput} from './inputs/FileInput';
import {MemoizedRectInput} from './inputs/RectInput';
import {VisualizationFormProps} from './types';
import {useVisualizationForm} from './hooks';

export function VisualizationForm(props: VisualizationFormProps) {
    const {model, handleVisualizationSizeChange, handleFramesChange, handleImageChange, submit} = useVisualizationForm(props);
    return (
        <div className={'frame-form'}>
            <div className="frame-form__inputs">
                <MemoizedFileInput onChange={handleImageChange} />
                <MemoizedRectInput value={model.visualizationSize} onChange={handleVisualizationSizeChange} />
                <FrameSelect frames={model.frames} options={props.frameOptions} onChange={handleFramesChange} />
                <button onClick={submit}>Submit</button>
            </div>
        </div>
    );
}
