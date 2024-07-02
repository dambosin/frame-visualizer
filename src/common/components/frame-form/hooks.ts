import {Rectangle} from '@/common/types';
import {VisualizationFormErrors, VisualizationFormProps, VisualizationModel, useVisualizationFormReturnType} from './types';
import {useState} from 'react';
import {FrameViewModel} from '@/common/services/frame-service/types';

function isSizeValid(size: Rectangle, minSize: Rectangle, maxSize: Rectangle): boolean {
    return (
        size && size.width >= minSize.width && size.width <= maxSize.width && size.height >= minSize.height && size.height <= maxSize.height
    );
}

function isImageSizeValid(size: number): boolean {
    const maxSize = 1024 * 20;
    return size <= maxSize && size > 0;
}

function isImageTypeValid(type: string): boolean {
    const allowedTypes = ['image/png', 'image/jpeg'];
    return allowedTypes.includes(type);
}

export function useVisualizationForm({frameOptions, onSubmit, visualizationSize}: VisualizationFormProps): useVisualizationFormReturnType {
    const [model, setModel] = useState<VisualizationModel>({
        frames: frameOptions,
        visualizationSize,
    });
    const [errors, setErrors] = useState<VisualizationFormErrors>({});

    function handleVisualizationSizeChange(value: Rectangle) {
        const minSize: Rectangle = {
            width: 20,
            height: 20,
        };

        const maxSize: Rectangle = {
            width: 200,
            height: 200,
        };
        if (isSizeValid(value, minSize, maxSize)) {
            setModel({...model, visualizationSize: value});
            setErrors({...errors, visualizationSize: ''});
        } else {
            setErrors({
                ...errors,
                visualizationSize: `Invalid size. Min size is ${minSize.width}x${minSize.height} and max size is ${maxSize.width}x${maxSize.height}`,
            });
        }
    }

    function handleFramesChange(frames: FrameViewModel[]) {
        if (frames.length > 0) {
            setModel({...model, frames});
            setErrors({...errors, frames: ''});
        } else {
            setModel({...model, frames: []});
            setErrors({...errors, frames: 'Must be selected at least one frame'});
        }
    }

    function handleImageChange(image: File) {
        if (!isImageTypeValid(image.type)) {
            setErrors({...errors, image: 'Invalid image type'});
            return;
        }
        if (isImageSizeValid(image.size)) {
            setErrors({...errors, image: 'Invalid image size'});
            return;
        }

        setModel({...model, image});
        setErrors({...errors, image: 'Invalid image'});
    }

    function handleSubmit() {
        onSubmit(model);
    }
    return {
        model,
        errors,
        handleVisualizationSizeChange,
        handleFramesChange,
        handleImageChange,
        submit: handleSubmit,
    };
}
