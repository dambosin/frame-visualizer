import {Rectangle} from '@/common/types';
import {FrameModel, FrameSaveModel, FrameServiceErrorCode, FrameViewModel, IFrameService} from './types';
import fs from 'fs';
import path from 'path';
import {inject, injectable} from 'inversify';
import {TYPES} from '@/common/inversify/types';
import type {IMapper} from '@/common/auto-mapper/types';
import 'reflect-metadata';

@injectable()
export class FrameService implements IFrameService {
    private readonly _fileName: string;
    private readonly _folder: string;
    private readonly _mapper: IMapper;

    constructor(@inject(TYPES.AutoMapper) mapper: IMapper, framesFolder: string, fileDB: string) {
        this._folder = path.join(__dirname, framesFolder);
        this._fileName = fileDB;
        this._mapper = mapper;
    }

    getFrames(): FrameViewModel[] {
        return this._mapper.mapArray<FrameModel, FrameViewModel>(this.loadFramesFromFile(), 'FrameModel', 'FrameViewModel');
    }

    saveFrame(frame: FrameSaveModel): void {
        const frames = this.loadFramesFromFile();
        if (frames.some((f) => f.frameId === frame.frameId)) {
            throw new ReferenceError(FrameServiceErrorCode.ExistingFrameID);
        }
        const currentDateAsJson = new Date().toJSON().slice(0, 10);
        let counter = 0;
        frames.forEach((frame) => {
            if (frame.imageSrc.includes(currentDateAsJson)) {
                counter++;
            }
        });
        const imageSrc = currentDateAsJson + '_' + counter + '.jpg';
        const imagePath = path.join(this._folder, 'frames', imageSrc);
        fs.writeFileSync(imagePath, frame.image, 'binary');
        const newFrameModels = [
            ...frames,
            this._mapper.map<FrameSaveModel, FrameModel>(frame, 'FrameSaveModel', 'FrameModel', {
                extraArgs: () => ({imageSrc}),
            }),
        ];
        const framesPath = path.join(this._folder, this._fileName);
        fs.writeFileSync(framesPath, JSON.stringify(newFrameModels));
    }

    private loadFramesFromFile(): FrameModel[] {
        const dataPath = path.join(this._folder, this._fileName);
        const josnString = fs.readFileSync(dataPath, 'utf-8');
        try {
            const frames: FrameModel[] = JSON.parse(josnString);

            const result: {
                frame: FrameModel;
                errors: FrameServiceErrorCode[];
            }[] = [];
            frames.forEach((frame) => result.push({frame, errors: this.validateFrameHasCorrectModel(frame)}));

            const framesWithErorrs = result.filter((result) => result.errors.length > 0);
            framesWithErorrs.forEach((frame) => {
                console.error(frame.errors, frame.frame);
            });
            return framesWithErorrs.length === 0 ? frames : [];
        } catch (error) {
            throw new Error(`Error parsing JSON file: ${error}`);
        }
    }

    private validateFrameHasCorrectModel(frame: FrameModel): FrameServiceErrorCode[] {
        const errors: FrameServiceErrorCode[] = [];
        if (!frame) {
            errors.push(FrameServiceErrorCode.MissedModel);
        } else {
            errors.push(
                ...([
                    frame.id ? null : FrameServiceErrorCode.MissedID,
                    frame.frameId ? null : FrameServiceErrorCode.MissedFrameID,
                    frame.frameSize ? this.validateSize(frame.frameSize) : FrameServiceErrorCode.MissedFrameSize,
                    frame.price ? this.validatePrice(frame.price) : FrameServiceErrorCode.MissedPrice,
                    frame.visualizationFrameSize
                        ? this.validateSize(frame.visualizationFrameSize)
                        : FrameServiceErrorCode.MissedVisualizationFrameSize,
                    frame.imageSrc ? this.validateImageSrc(frame.imageSrc) : FrameServiceErrorCode.MissedImageSrc,
                ].filter((error) => !!error) as FrameServiceErrorCode[])
            );
        }
        return errors;
    }

    private validateSize(size: Rectangle): FrameServiceErrorCode | null {
        return size.width > 0 && size.height > 0 ? null : FrameServiceErrorCode.IncorrectFrameSize;
    }

    private validatePrice(price: number): FrameServiceErrorCode | null {
        return price > 0 ? null : FrameServiceErrorCode.IncorrectPrice;
    }

    private validateImageSrc(imageSrc: string): FrameServiceErrorCode | null {
        return imageSrc.includes('.jpg') || imageSrc.includes('.png') ? null : FrameServiceErrorCode.IncorrectImageSrc;
    }
}
