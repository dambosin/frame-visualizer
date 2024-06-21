'use client';
import React, {ReactNode, createContext, useCallback, useState} from 'react';
import './ModalProvider.css';

type ModalContextProps = {
    openModal: (modal: ReactNode) => void;
    closeModal: () => void;
};

export const ModalContext = createContext<ModalContextProps>({openModal: () => {}, closeModal: () => {}});

type ModalProviderProps = {
    children: ReactNode;
};

export function ModalProvider({children}: ModalProviderProps) {
    const [content, setContent] = useState<ReactNode>();
    const handleContentChange = useCallback((content: ReactNode) => {
        setContent(content);
    }, []);

    const openModal = useCallback((modal: ReactNode) => handleContentChange(modal), [handleContentChange]);

    const closeModal = useCallback(() => handleContentChange(undefined), [handleContentChange]);

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            <div className={`${content ? '' : 'modal-provider_hidden'} modal-provider`}>{content}</div>
            {children}
        </ModalContext.Provider>
    );
}
