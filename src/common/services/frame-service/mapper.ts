import {IMapping} from '@/common/auto-mapper/types';
import {FrameModel, FrameSaveModel, FrameSaveModelAdditionalArgs, FrameViewModel} from './types';
import {Mapper, createMap, forMember, fromValue, mapFrom, mapWithArguments} from '@automapper/core';
import {v4 as uuid} from 'uuid';

export class FrameMapping implements IMapping {
    createMappings(mapper: Mapper): void {
        createMap<FrameModel, FrameViewModel>(
            mapper,
            'FrameModel',
            'FrameViewModel',
            forMember(
                (destination) => destination.frameId,
                mapFrom((source) => source.frameId)
            ),
            forMember(
                (destination) => destination.frameSize,
                mapFrom((source) => source.frameSize)
            ),
            forMember(
                (destination) => destination.price,
                mapFrom((source) => source.price)
            ),
            forMember(
                (destination) => destination.visualizationFrameSize,
                mapFrom((source) => source.visualizationFrameSize)
            ),
            forMember(
                (destination) => destination.imageSrc,
                mapFrom((source) => source.imageSrc)
            )
        );

        createMap<FrameSaveModel, FrameModel>(
            mapper,
            'FrameSaveModel',
            'FrameModel',
            forMember((destination) => destination.id, fromValue(uuid())),
            forMember(
                (destination) => destination.frameId,
                mapFrom((source) => source.frameId)
            ),
            forMember(
                (destination) => destination.frameSize,
                mapFrom((source) => source.frameSize)
            ),
            forMember(
                (destination) => destination.price,
                mapFrom((source) => source.price)
            ),
            forMember(
                (destination) => destination.visualizationFrameSize,
                mapFrom((source) => source.visualizationFrameSize)
            ),
            forMember(
                (destination) => destination.imageSrc,
                mapWithArguments((_source, {imageSrc}: Record<FrameSaveModelAdditionalArgs, unknown>) => imageSrc)
            )
        );

        // const frameSaveModel: FrameSaveModel = {
        //     frameId: '11',
        //     frameSize: {
        //         width: 100,
        //         height: 100,
        //     },
        //     price: 100,
        //     visualizationFrameSize: {
        //         width: 100,
        //         height: 100,
        //     },
        //     image: {} as File,
        // };

        // const result = mapper.map<FrameSaveModel, FrameModel>(frameSaveModel, 'FrameViewModel', 'FrameModel', {
        //     extraArgs: () => ({imageSrc: 'test.jpg'}),
        // });
        // console.log(result);
    }
    private logValue<TValue>(value: TValue) {
        console.log(value);
        return value;
    }
}
