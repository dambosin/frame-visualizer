'use client';
import Image from 'next/image';
import classes from './page.module.css';
import {FC, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {ModalContext} from '@/common/components/modal/ModalProvider';
import {useFrames} from '@/common/pages/visualization/hooks';
import {MemoizedFrameCard} from '@/common/components/frame-card/FrameCard';

function DevPage() {
    const [model, setModel] = useState<VisualizationModel>({
        images: [],
        visualizationSize: {
            width: 50,
            height: 50,
        },
        frames: [],
    });
    return (
        <div className={classes.page}>
            <FrameVisualizationForm model={model} handleModelChange={setModel} />
            <div className={classes.visualization}>visualization</div>
        </div>
    );
}

export default DevPage;

type Rectangle = {
    width: number;
    height: number;
};

type FrameViewModel = {
    frameId: string;
    frameSize: Rectangle;
    price: number;
    visualizationFrameSize: Rectangle;
    image: string;
};

type VisualizationModel = {
    images: File[];
    visualizationSize: Rectangle;
    frames: FrameViewModel[];
};

type FrameVisualizationFormProps = {
    model: VisualizationModel;
    handleModelChange: (model: VisualizationModel) => void;
};

function FrameVisualizationForm({model, handleModelChange}: FrameVisualizationFormProps) {
    const [formModel, setFormModel] = useState<VisualizationModel>(model);
    function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files) {
            const images = Array.from(files).filter((f) => f);
            setFormModel({...formModel, images});
        }
    }

    function handleWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 10 && value <= 100) {
            setFormModel({...formModel, visualizationSize: {...formModel.visualizationSize, width: value}});
        }
    }

    function handleHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 10 && value <= 100) {
            setFormModel({...formModel, visualizationSize: {...formModel.visualizationSize, height: value}});
        }
    }

    function handleSwapClick() {
        setFormModel({
            ...formModel,
            visualizationSize: {
                width: formModel.visualizationSize.height,
                height: formModel.visualizationSize.width,
            },
        });
    }

    function handleSubmit() {
        handleModelChange(formModel);
    }

    const {openModal, closeModal, onContentChange} = useContext(ModalContext);

    const options = useFrames();
    const modalContent = useCallback(() => {
        function handleFrameSelect(frameId: string) {
            if (frameId) {
                if (formModel.frames.map((frame) => frame.frameId).includes(frameId)) {
                    setFormModel({
                        ...formModel,
                        frames: formModel.frames.filter((frame) => frame.frameId !== frameId),
                    });
                } else {
                    const frame = options.find((frame) => frame.frameId === frameId);
                    if (frame) setFormModel({...formModel, frames: [...formModel.frames, frame]});
                }
            }
        }
        return (
            <>
                <div className={classes.modal__header}>
                    <span>Select Frames</span>
                </div>
                <div className={classes.modal__content}>
                    {options.map((option: {image: any; frameId: any; price: any}) => {
                        return (
                            <MemoizedFrameCard
                                img={option.image}
                                key={option.frameId}
                                price={option.price}
                                onClick={() => handleFrameSelect(option.frameId)}
                                selected={formModel.frames.map((frame: {frameId: any}) => frame.frameId).includes(option.frameId)}
                            />
                        );
                    })}
                </div>
            </>
        );
    }, [formModel, options]);
    const modal = useMemo<FC>(() => modalContent, [modalContent]);

    useEffect(() => {
        onContentChange(modal);
        return () => closeModal();
    }, [modal, onContentChange, closeModal]);

    return (
        <div className={classes.form}>
            <div className={classes['form-inner']}>
                <div className={classes['form-inputs']}>
                    <div className={classes['image-input']}>
                        <span className={classes.label}>Выбор Файла</span>
                        <label htmlFor="image-input" className={classes['image-input-label']}>
                            <Image src="/file-upload-icon.svg" alt={'Upload image'} width="64" height="64" />
                        </label>
                        <input
                            id="image-input"
                            type="file"
                            value={model.images.map((i) => i.webkitRelativePath)}
                            onChange={handleImagesChange}
                            hidden
                        />
                    </div>
                    <div className={classes.input}>
                        <label htmlFor="size-input" className={classes.label}>
                            <span>Размер:</span>
                        </label>
                        <input id="size-input" type="number" value={model.visualizationSize.width} onSubmit={handleWidthChange} />
                        <Image
                            src="/reverse.png"
                            width="32"
                            height="21"
                            alt={'Change width and height'}
                            className={classes['size-reverse']}
                            onClick={handleSwapClick}
                        />
                        <input type="number" value={model.visualizationSize.height} onChange={handleHeightChange} />
                    </div>
                    <div className={classes.input}>
                        <label htmlFor="frame-select" className={classes.label}>
                            <span>Багет:</span>
                        </label>
                        <button id="frame-select" className={classes['frame-select-button']} onClick={() => openModal()} />
                    </div>
                    <button onClick={handleSubmit} className={classes.button}>
                        <label className={classes.label}>
                            <span>Создать визуализацию</span>
                        </label>
                    </button>
                </div>
            </div>
        </div>
    );
}
