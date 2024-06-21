import {Rectangle} from '@/common/types';
import {VisualizationModel} from '../frame-selector/types';
import {FrameViewModel} from '@/common/services/FrameService/types';

export type VisualizationFormProps = {
    visualizationSize: Rectangle;
    frameOptions: FrameViewModel[];
    onSubmit: (model: VisualizationModel) => void;
};

export type VisualizationFormErrors = {
    visualizationSize?: string;
    frames?: string;
    image?: string;
};

export type useVisualizationFormReturnType = {
    model: VisualizationModel;
    errors: VisualizationFormErrors;
    handleVisualizationSizeChange: (value: Rectangle) => void;
    handleFramesChange: (value: FrameViewModel[]) => void;
    handleImageChange: (value: File) => void;
    submit: () => void;
};
