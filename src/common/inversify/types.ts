import {Container, interfaces} from 'inversify';

export const TYPES = {
    AutoMapper: Symbol.for('AutoMapper'),
    FrameService: Symbol.for('FrameService'),
};

export interface IContainerBuilder {
    build(): Container;
}

export interface IContainer {
    get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T;
}
