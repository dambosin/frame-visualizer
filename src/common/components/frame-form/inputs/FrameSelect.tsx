import {useCallback, useEffect, useMemo} from 'react';
import {MemoizedFrameCard} from '../../frame-card/FrameCard';
import {FrameViewModel} from '@/common/services/frame-service/types';
import classes from './FrameSelect.module.css';
import {useModal} from '../../modal/hook';

type FrameSelectProps = {
    error?: string;
    frames: FrameViewModel[];
    options: FrameViewModel[];
    onChange: (value: FrameViewModel[]) => void;
};

export function FrameSelect({frames, options, onChange}: FrameSelectProps) {
    const {openModal, closeModal, setModalContent, isOpen} = useModal();

    const handleChange = useCallback(
        (frameId: string) => {
            if (frameId) {
                if (frames.map((frame) => frame.frameId).includes(frameId)) {
                    onChange(frames.filter((frame) => frame.frameId !== frameId));
                } else {
                    const frame = options.find((frame) => frame.frameId === frameId);
                    if (frame) onChange([...frames, frame]);
                }
            }
        },
        [frames, onChange, options]
    );

    const ModalContent = useMemo(
        () =>
            function ModalContent() {
                return (
                    <>
                        <h2 className={classes.frameSelect__modalHeader}>Select Frames</h2>
                        <div className={classes.frameSelect__modalContent}>
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
                    </>
                );
            },
        [frames, handleChange, options]
    );

    useEffect(() => {
        if (isOpen) {
            setModalContent(ModalContent);
        }
    }, [isOpen, ModalContent, setModalContent, closeModal]);

    const handleOpenModal = useCallback(() => {
        setModalContent(ModalContent);
        openModal();
    }, [openModal, setModalContent, ModalContent]);

    return (
        <div className={'frame-form__frame-input'}>
            <label htmlFor={'frame-input'} className={'frame-form__frame-input-label'}>
                Багет:
            </label>
            <input type={'button'} id={'frame-input'} className={'frame-form__frame-input-button'} onClick={handleOpenModal} />
        </div>
    );
}
