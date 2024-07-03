import {FrameViewModel} from '@/common/services/frame-service/types';
import {Rectangle} from '@/common/types';

export type VisualizationFormProps = {
    model: VisualizationModel;
    onChange: (model: VisualizationModel) => void;
};

export type VisualizationModel = {
    [x: string]: any;
    images: File[];
    visualizationSize: Rectangle;
    frames: FrameViewModel[];
};

export type FormErrors = Partial<Record<keyof VisualizationModel, string>>;

export type useVisualizationFormReturnType = {
    formModel: VisualizationModel;
    errors: FormErrors;
    handleVisualizationSizeChange: (value: Rectangle) => void;
    handleFramesChange: (value: FrameViewModel[]) => void;
    handleImageChange: (value: File[]) => void;
    submit: () => void;
};
