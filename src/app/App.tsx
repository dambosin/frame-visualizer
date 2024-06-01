'use client';
import {ContainerBuilder} from '@/common/inversify/ContainerBuilder';
import {ContainerProvider} from '@/common/inversify/components/ContainerProvider';
import {PropsWithChildren} from 'react';

export function App({children}: PropsWithChildren) {
    const container = new ContainerBuilder().build();
    return <ContainerProvider container={container}>{children}</ContainerProvider>;
}
