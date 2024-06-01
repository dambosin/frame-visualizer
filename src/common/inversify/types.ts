import {Container} from 'inversify';

export const TYPES = {};

export interface IContainerBuilder {
    build(): Container;
}
