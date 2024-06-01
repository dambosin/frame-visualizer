import {Container} from 'inversify';
import {IContainerBuilder} from './types';

export class ContainerBuilder implements IContainerBuilder {
    public build(): Container {
        const container = new Container();

        return container;
    }
}
