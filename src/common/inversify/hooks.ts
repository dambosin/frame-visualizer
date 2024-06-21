import {useContext} from 'react';
import {IContainer, TYPES} from './types';
import {ContainerContext} from './components/ContainerProvider';
import {IFrameService} from '../services/frame-service/types';

export function useFrameService() {
    return useContext<IContainer>(ContainerContext).get<IFrameService>(TYPES.FrameService);
}
