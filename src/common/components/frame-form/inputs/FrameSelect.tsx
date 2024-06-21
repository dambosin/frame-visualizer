import {useContext, useEffect, useMemo, useState} from 'react';
import {ModalContext} from '../../modal/ModalProvider';
import {MemoizedFrameCard} from '../../frame-card/FrameCard';
import {FrameViewModel} from '@/common/services/frame-service/types';

type FrameSelectProps = {
    error?: string;
    frames: FrameViewModel[];
    options: FrameViewModel[];
    onChange: (value: FrameViewModel[]) => void;
};

export function FrameSelect({frames, options, onChange}: FrameSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const {openModal, closeModal} = useContext(ModalContext);

    function handleOpen() {
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
    }
    const header = useMemo(
        () => (
            <div className={'frame-form__modal-header'}>
                <h2>Select Frames</h2>
                <button className={'frame-form__modal-close-button'} onClick={handleClose}>
                    X
                </button>
            </div>
        ),
        []
    );

    useEffect(() => {
        function handleChange(frameId: string) {
            if (frameId) {
                if (frames.map((frame) => frame.frameId).includes(frameId)) {
                    onChange(frames.filter((frame) => frame.frameId !== frameId));
                } else {
                    const frame = options.find((frame) => frame.frameId === frameId);
                    if (frame) onChange([...frames, frame]);
                }
            }
        }

        const content = (
            <div className={'frame-form__modal-content'}>
                {options.map((option) => {
                    return (
                        <MemoizedFrameCard
                            img={option.image}
                            key={option.frameId}
                            price={option.price}
                            onClick={() => handleChange(option.frameId)}
                            selected={frames.map((frame) => frame.frameId).includes(option.frameId)}
                        />
                    );
                })}
            </div>
        );

        function open() {
            openModal(
                <div className={'frame-form__modal'}>
                    {header}
                    {content}
                </div>
            );
        }
        if (isOpen) {
            open();
        } else {
            closeModal();
        }
    }, [isOpen, closeModal, openModal, header, options, frames, onChange]);

    return (
        <div className={'frame-form__frame-input'}>
            <label htmlFor={'frame-input'} className={'frame-form__frame-input-label'}>
                Багет:
            </label>
            <input type={'button'} id={'frame-input'} className={'frame-form__frame-input-button'} onClick={handleOpen} />
        </div>
    );
}
