'use client';
import {ModalProvider} from '@/common/components/modal/ModalProvider';
import {ContainerBuilder} from '@/common/inversify/ContainerBuilder';
import {ContainerProvider} from '@/common/inversify/components/ContainerProvider';
import {PropsWithChildren} from 'react';

export function App({children}: PropsWithChildren) {
    const container = new ContainerBuilder().build();
    return (
        <ContainerProvider container={container}>
            <ModalProvider>{children}</ModalProvider>
        </ContainerProvider>
    );
}
