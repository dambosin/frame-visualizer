import {Container, interfaces} from 'inversify';

export const TYPES = {};

export interface IContainerBuilder {
    build(): Container;
}

export interface IContainer {
    get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T;
}
