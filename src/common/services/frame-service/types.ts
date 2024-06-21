import {Rectangle} from '@/common/types';

export interface IFrameService {
    getFrames(): Promise<FrameViewModel[]>;
    saveFrame(frame: FrameSaveModel): void;
}

export type FrameBaseModel = {
    frameId: string;
    frameSize: Rectangle;
    price: number;
    visualizationFrameSize: Rectangle;
};

export type FrameViewModel = FrameBaseModel & {
    image: string;
};

export type FrameSaveModel = FrameBaseModel & {
    image: Buffer;
};

export type FrameSaveModelAdditionalArgs = 'imageSrc';

export type FrameModel = FrameViewModel & {
    id: string;
};

export enum FrameServiceErrorCode {
    MissedModel = 'FrameService.MissedModel',
    MissedID = 'FrameService.MissedID',
    ExistingFrameID = 'FrameService.ExistingFrameID',
    MissedFrameID = 'FrameService.MissedFrameID',
    MissedImage = 'FrameService.MissedImage',
    MissedPrice = 'FrameService.MissedPrice',
    IncorrectPrice = 'FrameService.IncorrectPrice',
    MissedFrameSize = 'FrameService.MissedFrameSize',
    IncorrectFrameSize = 'FrameService.IncorrectFrameSize',
    MissedVisualizationFrameSize = 'FrameService.MissedVisualizationFrameSize',
    IncorrectVisualizationFrameSize = 'FrameService.IncorrectVisualizationFrameSize',
    MissedImageSrc = 'FrameService.MissedImageSrc',
    IncorrectImageSrc = 'FrameService.IncorrectImageSrc',
}
