import {useContext} from 'react';
import {IContainer, TYPES} from '../inversify/types';
import {ContainerContext} from '../inversify/components/ContainerProvider';
import {IMapper} from './types';

export function useAutoMapper() {
    return useContext<IContainer>(ContainerContext).get<IMapper>(TYPES.AutoMapper);
}
