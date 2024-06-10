import {getMapper} from '@/common/testUtils';
import {FrameService} from './FrameService';
import {FrameMapping} from './mapper';
import {FrameSaveModel} from './types';
import fs from 'fs';
import path from 'path';

describe('FrameService', () => {
    const testFolder = 'test';
    const framesDB = 'framesDB.json';
    const framesFolder = 'frames';
    const framesPath = path.join(__dirname, testFolder, framesFolder);
    const pathDB = path.join(__dirname, testFolder, framesDB);
    const filePath = path.join(__dirname, testFolder, './test.jpg');
    beforeEach(() => {
        fs.writeFileSync(pathDB, '[]');
    });
    afterEach(() => {
        fs.readdir(framesPath, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(framesPath, file), (err) => {
                    if (err) throw err;
                });
            }
        });
        fs.unlinkSync(pathDB);
    });
    it('Check saveFrame correctly saves file', () => {
        const mapper = getMapper([new FrameMapping()]);
        const mock = jest.spyOn(FrameService.prototype, 'saveFrame');
        const frameService = new FrameService(mapper, testFolder, framesDB);
        const buffer = fs.readFileSync(filePath);
        const frame: FrameSaveModel = {
            frameId: '1',
            frameSize: {
                width: 100,
                height: 100,
            },
            price: 100,
            visualizationFrameSize: {
                width: 100,
                height: 100,
            },
            image: buffer,
        };

        frameService.saveFrame(frame);

        fs.readdirSync(framesPath).forEach((file) => {
            expect(file.includes('.jpg')).toBeTruthy();
        });
        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock).toHaveBeenCalledWith(frame);
    });
});
