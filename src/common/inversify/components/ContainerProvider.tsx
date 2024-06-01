'use client';
import {Container} from 'inversify';
import {PropsWithChildren, createContext} from 'react';

export const ContainerContext = createContext<Container>(new Container());

type ContainerProviderProps = {
    container: Container;
};

export function ContainerProvider({children, container}: PropsWithChildren<ContainerProviderProps>) {
    return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}
