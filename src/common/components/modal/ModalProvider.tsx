'use client';

import React, {FC, createContext, useState} from 'react';
import classes from './ModalProvider.module.css';

type ModalContextProps = {
    openModal: () => void;
    closeModal: () => void;
    setModalContent: (content: FC | undefined) => void;
    isOpen: boolean;
};

export const ModalContext = createContext<ModalContextProps>({
    openModal: () => {},
    closeModal: () => {},
    setModalContent: () => {},
    isOpen: false,
} as ModalContextProps);

export function ModalProvider({children}: {children: React.ReactNode}) {
    const [Content, setContent] = useState<FC | undefined>();
    const [isOpen, setIsOpen] = useState(false);

    function setModalContent(content: FC | undefined) {
        setContent(() => content);
    }
    const Component = Content;

    return (
        <ModalContext.Provider value={{openModal: () => setIsOpen(true), closeModal: () => setIsOpen(false), setModalContent, isOpen}}>
            {isOpen && Component ? (
                <Modal onClose={() => setIsOpen(false)}>
                    <Component />
                </Modal>
            ) : null}
            {children}
        </ModalContext.Provider>
    );
}

type ModalProps = {
    children?: React.ReactNode;
    onClose: () => void;
};

export function Modal({onClose, children}: ModalProps) {
    return (
        <div className={classes.modal__background}>
            <div className={classes.modal}>
                <button onClick={onClose} className={classes.modal__closeButton}>
                    X
                </button>
                {children}
            </div>
        </div>
    );
}
