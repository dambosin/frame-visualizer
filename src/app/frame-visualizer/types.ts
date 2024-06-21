import {FrameViewModel} from '@/common/services/frame-service/types';
import {Rectangle} from '@/common/types';

export type VisualizationModel = {
    image?: File;
    visualizationSize: Rectangle;
    frames: FrameViewModel[];
};
