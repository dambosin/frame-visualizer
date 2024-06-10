import {createMapper} from '@automapper/core';
import {pojos} from '@automapper/pojos';
import {FrameMapping} from './mapper';
import {FrameModel, FrameSaveModel, FrameViewModel} from './types';

describe('FrameMapping', () => {
    it('Mapping from FrameModel to FrameViewModel', () => {
        const mapper = createMapper({
            strategyInitializer: pojos(),
        });
        new FrameMapping().createMappings(mapper);

        const frameModel: FrameModel = {
            id: '1',
            frameId: '11',
            frameSize: {
                width: 100,
                height: 100,
            },
            price: 100,
            visualizationFrameSize: {
                width: 100,
                height: 100,
            },
            imageSrc: 'test.jpg',
        };

        const result = mapper.map<FrameModel, FrameViewModel>(frameModel, 'FrameModel', 'FrameViewModel');

        expect(result.frameId).toEqual(frameModel.frameId);
        expect(result.frameSize).toEqual(frameModel.frameSize);
        expect(result.price).toEqual(frameModel.price);
        expect(result.visualizationFrameSize).toEqual(frameModel.visualizationFrameSize);
        expect(result.imageSrc).toEqual(frameModel.imageSrc);
    });
    it('Mapping from FrameSaveModel to FrameModel', () => {
        const mapper = createMapper({
            strategyInitializer: pojos(),
        });
        new FrameMapping().createMappings(mapper);

        const frameSaveModel: FrameSaveModel = {
            frameId: '11',
            frameSize: {
                width: 100,
                height: 100,
            },
            price: 100,
            visualizationFrameSize: {
                width: 100,
                height: 100,
            },
            image: {} as File,
        };

        const result = mapper.map<FrameSaveModel, FrameModel>(frameSaveModel, 'FrameSaveModel', 'FrameModel', {
            extraArgs: () => ({imageSrc: 'test.jpg'}),
        });

        expect(result.id).toBeDefined();
        expect(result.frameId).toEqual(frameSaveModel.frameId);
        expect(result.frameSize).toEqual(frameSaveModel.frameSize);
        expect(result.price).toEqual(frameSaveModel.price);
        expect(result.visualizationFrameSize).toEqual(frameSaveModel.visualizationFrameSize);
        expect(result.imageSrc).toEqual('test.jpg');
    });
});
