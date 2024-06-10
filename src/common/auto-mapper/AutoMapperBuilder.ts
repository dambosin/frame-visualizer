import {Mapper, createMapper} from '@automapper/core';
import {IAutoMapperBuilder, IMapping} from './types';
import {pojos} from '@automapper/pojos';
import {FrameMapping} from '../services/frame-service/mapper';

export class AutoMapperBuilder implements IAutoMapperBuilder {
    public build(): Mapper {
        const mapper = createMapper({
            strategyInitializer: pojos(),
        });

        const mappings: IMapping[] = [new FrameMapping()];

        mappings.forEach((mapping) => mapping.createMappings(mapper));

        return mapper;
    }
}
