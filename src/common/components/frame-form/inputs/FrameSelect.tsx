import {FrameViewModel} from '@/common/services/frame-service/types';
import classes from '../VisualizationForm.module.css';
import {MemoizedFrameCard} from '../../frame-card/FrameCard';
import {useFrames} from '@/common/pages/visualization/hooks';
import {useModal} from '../../modal/hook';
import {useCallback, useEffect, useMemo} from 'react';

type FrameSelectModalProps = {
    frames: FrameViewModel[];
    onSelect: (frameId: string) => void;
    options: FrameViewModel[];
};

function FrameSelectModal({frames, onSelect, options}: FrameSelectModalProps) {
    function handleFrameSelect(frameId: string) {
        if (frameId) {
            onSelect(frameId);
        }
    }

    return (
        <>
            <h2 className={classes.modal__header}>Select Frames</h2>
            <div className={classes.modal__content}>
                {options.map((option) => {
                    return (
                        <MemoizedFrameCard
                            img={option.image}
                            key={option.frameId}
                            price={option.price}
                            onClick={() => handleFrameSelect(option.frameId)}
                            selected={frames.map((frame) => frame.frameId).includes(option.frameId)}
                        />
                    );
                })}
            </div>
        </>
    );
}

type FrameSelectButtonProps = {
    frames: FrameViewModel[];
    onChange: (frames: FrameViewModel[]) => void;
    error?: string;
};

export function FrameSelectButton({frames, onChange, error}: FrameSelectButtonProps) {
    const options = useFrames();

    const {openModal, isOpen, setModalContent} = useModal();

    const handleSelect = useCallback(
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

    const ModalContent = useMemo(() => {
        return function Modal() {
            return <FrameSelectModal frames={frames} onSelect={handleSelect} options={options} />;
        };
    }, [frames, handleSelect, options]);

    useEffect(() => {
        if (isOpen) {
            setModalContent(ModalContent);
        }
    }, [ModalContent, isOpen, setModalContent]);

    return (
        <div className={classes.input}>
            <label htmlFor="frame-select" className={classes.form__label}>
                <span>Багет:</span>
            </label>
            <button id="frame-select" className={classes.frameSelect__button} onClick={() => openModal()}>
                {frames.map((frame) => frame.frameId).join(', fadfdafdafadfafadfadfadf')}
            </button>
            {error ? <span className={classes.form__error}>{error}</span> : null}
        </div>
    );
}
