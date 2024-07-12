import {Rectangle} from '@/common/types';
import {FormErrors, VisualizationFormProps, VisualizationModel, useVisualizationFormReturnType} from './types';
import {useCallback, useState} from 'react';
import {FrameViewModel} from '@/common/services/frame-service/types';

export function useVisualizationForm({model, onChange}: VisualizationFormProps): useVisualizationFormReturnType {
    const [formModel, setFormModel] = useState<VisualizationModel>(model);
    const [errors, setErrors] = useState<FormErrors>({});
    const handleSubmit = useCallback(() => {
        function isModelValid(model: VisualizationModel): boolean {
            const errors: FormErrors = {};
            let res = true;
            if (model.images.length === 0) {
                errors.images = 'Необходимо выбрать хотя бы одно изображение';
                res = false;
            } else {
                errors.images = '';
            }
            if (
                model.visualizationSize.width < 10 ||
                model.visualizationSize.width > 100 ||
                model.visualizationSize.height < 10 ||
                model.visualizationSize.height > 100
            ) {
                errors.visualizationSize = 'Значение должно быть в пределах от 10 до 100';
                res = false;
            } else {
                errors.visualizationSize = '';
            }
            if (model.frames.length === 0) {
                errors.frames = 'Необходимо выбрать хотя бы один багет';
                res = false;
            } else {
                errors.frames = '';
            }
            setErrors(errors);
            return res;
        }

        if (isModelValid(formModel)) {
            onChange(formModel);
        }
    }, [formModel, onChange]);

    function handleVisualizationSizeChange(value: Rectangle) {
        setFormModel({...formModel, visualizationSize: value});
    }

    function handleFramesChange(value: FrameViewModel[]) {
        setFormModel({...formModel, frames: value});
    }

    function handleImageChange(value: File[]) {
        setFormModel({...formModel, images: value});
    }
    return {
        formModel,
        errors,
        handleVisualizationSizeChange,
        handleFramesChange,
        handleImageChange,
        submit: handleSubmit,
    };
}
