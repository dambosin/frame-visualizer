import {Dictionary, MapOptions, Mapper, ModelIdentifier} from '@automapper/core';

export interface IAutoMapperBuilder {
    build(): Mapper;
}

export interface IMapping {
    createMappings(mapper: Mapper): void;
}

export interface IMapper {
    map<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
        sourceObject: TSource,
        sourceIdentifier: ModelIdentifier<TSource>,
        destinationIdentifier: ModelIdentifier<TDestination>,
        options?: MapOptions<TSource, TDestination>
    ): TDestination;
    map<TSource extends Dictionary<TSource>>(
        sourceObject: TSource,
        identifier: ModelIdentifier<TSource>,
        options?: MapOptions<TSource, TSource>
    ): TSource;
    mapArray<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
        sourceArray: TSource[],
        sourceIdentifier: ModelIdentifier<TSource>,
        destinationIdentifier: ModelIdentifier<TDestination>,
        options?: MapOptions<TSource[], TDestination[]>
    ): TDestination[];
    mapArray<TSource extends Dictionary<TSource>>(
        sourceArray: TSource[],
        identifier: ModelIdentifier<TSource>,
        options?: MapOptions<TSource[], TSource[]>
    ): TSource[];
}
