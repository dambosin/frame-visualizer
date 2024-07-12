import {createMapper} from '@automapper/core';
import {IMapper, IMapping} from './auto-mapper/types';
import {pojos} from '@automapper/pojos';

export function getMapper(mappings: IMapping[]): IMapper {
    const mapper = createMapper({
        strategyInitializer: pojos(),
    });

    mappings.forEach((mapping) => mapping.createMappings(mapper));
    return mapper;
}
