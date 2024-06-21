import {FrameViewModel} from '@/common/services/frame-service/types';
import {Rectangle} from '@/common/types';

export type VisualizationFormProps = {
    visualizationSize: Rectangle;
    frameOptions: FrameViewModel[];
    onSubmit: (model: VisualizationModel) => void;
};

export type VisualizationModel = {
    image?: File;
    visualizationSize: Rectangle;
    frames: FrameViewModel[];
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
