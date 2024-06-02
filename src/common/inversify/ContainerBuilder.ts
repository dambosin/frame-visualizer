import {Container} from 'inversify';
import {IContainerBuilder, TYPES} from './types';
import {AutoMapperBuilder} from '../auto-mapper/AutoMapperBuilder';
import {IMapper} from '../auto-mapper/types';

export class ContainerBuilder implements IContainerBuilder {
    public build(): Container {
        const container = new Container();

        const mapper = new AutoMapperBuilder().build();
        container.bind<IMapper>(TYPES.AutoMapper).toConstantValue(mapper);

        return container;
    }
}
