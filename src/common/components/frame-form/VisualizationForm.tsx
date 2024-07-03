'use-client';
import React from 'react';
import {FrameSelectButton} from './inputs/FrameSelect';
import classes from './VisualizationForm.module.css';
import {FileInput} from './inputs/FileInput';
import {VisualizationSizeInput} from './inputs/VisualizationSizeInput';
import {VisualizationFormProps} from './types';
import {useVisualizationForm} from './hooks';

export function VisualizationForm(props: VisualizationFormProps) {
    const {formModel, errors, handleVisualizationSizeChange, handleFramesChange, handleImageChange, submit} = useVisualizationForm(props);
    return (
        <div className={classes.form}>
            <div className={classes.form__inner}>
                <div className={classes.form__inputs}>
                    <FileInput files={formModel.images} onChange={handleImageChange} error={errors.images} />
                    <VisualizationSizeInput
                        visualizationSize={formModel.visualizationSize}
                        onChange={handleVisualizationSizeChange}
                        error={errors.visualizationSize}
                    />
                    <FrameSelectButton frames={formModel.frames} onChange={handleFramesChange} error={errors.frames} />
                    <button onClick={submit} className={classes.form__button}>
                        <label className={classes.form__label}>
                            <span>Создать визуализацию</span>
                        </label>
                    </button>
                </div>
            </div>
        </div>
    );
}
