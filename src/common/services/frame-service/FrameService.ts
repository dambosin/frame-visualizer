import {Rectangle} from '@/common/types';
import {FrameModel, FrameSaveModel, FrameServiceErrorCode, FrameViewModel, IFrameService} from './types';
import fs from 'fs';
import {inject, injectable} from 'inversify';
import {TYPES} from '@/common/inversify/types';
import type {IMapper} from '@/common/auto-mapper/types';
import 'reflect-metadata';

@injectable()
export class FrameService implements IFrameService {
    private readonly _fileName = 'framesDB.json';
    private readonly _mapper: IMapper;

    constructor(@inject(TYPES.AutoMapper) mapper: IMapper) {
        this._mapper = mapper;
    }

    getFrames(): FrameViewModel[] {
        return this._mapper.mapArray<FrameModel, FrameViewModel>(this.loadFramesFromFile(), 'FrameModel', 'FrameViewModel');
    }

    saveFrame(frame: FrameSaveModel): void {
        frame.image.arrayBuffer().then((arrayBuffer) => {
            const data = Buffer.from(arrayBuffer);
            const currentDate = new Date();
            const imageSrc = `${currentDate.toISOString().replace(':', '-').replace('.', '_')}.jpg`;
            fs.writeFile(imageSrc, data, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    const frameModel = this._mapper.map<FrameSaveModel, FrameModel>(frame, 'FrameSaveModel', 'FrameModel', {
                        extraArgs: () => ({imageSrc}),
                    });
                    const errors = this.validateFrameHasCorrectModel(frameModel);
                    if (errors.length > 0) {
                        console.error(errors, frameModel);
                    } else {
                        const frameModels: FrameModel[] = [...this.loadFramesFromFile(), frameModel];
                        const jsonString = JSON.stringify(frameModels);

                        fs.writeFile(this._fileName, jsonString, (err) => {
                            if (err) {
                                console.log('Error writing file:', err);
                            } else {
                                console.log('Successfully wrote file');
                            }
                        });
                    }
                }
            });
        });
    }

    private loadFramesFromFile(): FrameModel[] {
        const josnString = fs.readFileSync('./data.json', 'utf-8');
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
