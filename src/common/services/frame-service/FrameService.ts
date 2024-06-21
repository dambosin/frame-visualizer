import {FrameSaveModel, FrameViewModel, IFrameService} from './types';
import {injectable} from 'inversify';
import 'reflect-metadata';

@injectable()
export class FrameService implements IFrameService {
    constructor() {}

    async getFrames(): Promise<FrameViewModel[]> {
        return fetch('http://localhost:3514/frameService/getFrames')
            .then((response) => response.json())
            .then((data) => {
                const result = data as FrameViewModel[];
                return result;
            });
    }

    saveFrame(frame: FrameSaveModel): void {
        const model = {
            ...frame,
            image: frame.image.toString('base64'),
        };
        const body = JSON.stringify(model);
        console.log(body);
        fetch('http://localhost:3514/frameService/saveFrame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
        });
    }
}
