import {useContext, useMemo} from 'react';
import {IContainer, TYPES} from './types';
import {ContainerContext} from './components/ContainerProvider';
import {IFrameService} from '../services/frame-service/types';

export function useFrameService() {
    const container = useContext<IContainer>(ContainerContext);
    const service = useMemo<IFrameService>(() => container.get<IFrameService>(TYPES.FrameService), [container]);
    return service;
}
