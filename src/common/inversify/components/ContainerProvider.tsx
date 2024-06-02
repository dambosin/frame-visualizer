'use client';
import {Container} from 'inversify';
import {PropsWithChildren, createContext} from 'react';
import {IContainer} from '../types';

export const ContainerContext = createContext<IContainer>(new Container());

type ContainerProviderProps = {
    container: IContainer;
};

export function ContainerProvider({children, container}: PropsWithChildren<ContainerProviderProps>) {
    return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}
