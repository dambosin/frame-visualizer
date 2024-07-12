'use client';
import React, {useContext, useState} from 'react';
import {FrameBaseModel, IFrameService} from '@/common/services/frame-service/types';
import {ContainerContext} from '@/common/inversify/components/ContainerProvider';
import {IContainer, TYPES} from '@/common/inversify/types';

const defaultModel: FrameBaseModel = {
    frameId: '',
    frameSize: {
        width: 20,
        height: 10,
    },
    price: 1.5,
    visualizationFrameSize: {
        width: 50,
        height: 20,
    },
};

export default function FrameSave() {
    const [formData, setFormData] = useState<FrameBaseModel>(defaultModel);
    const [image, setImage] = useState<Buffer>(Buffer.from(''));

    function handleFraimIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value) {
            setFormData({
                ...formData,
                frameId: value,
            });
        }
    }

    function handleFrameSizeWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        if (!Number.isNaN(value) && value > 0) {
            setFormData({
                ...formData,
                frameSize: {
                    ...formData.frameSize,
                    width: value,
                },
            });
        }
    }

    function handleFrameSizeHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        if (!Number.isNaN(value) && value > 0) {
            setFormData({
                ...formData,
                frameSize: {
                    ...formData.frameSize,
                    height: value,
                },
            });
        }
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        if (!Number.isNaN(value) && value > 0) {
            setFormData({
                ...formData,
                price: value,
            });
        }
    }

    function handleVisualizationFrameSizeWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        if (!Number.isNaN(value) && value > 0) {
            setFormData({
                ...formData,
                visualizationFrameSize: {
                    ...formData.visualizationFrameSize,
                    width: value,
                },
            });
        }
    }

    function handleVisualizationFrameSizeHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(e.target.value);
        if (!Number.isNaN(value) && value > 0) {
            setFormData({
                ...formData,
                visualizationFrameSize: {
                    ...formData.visualizationFrameSize,
                    height: value,
                },
            });
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setImage(Buffer.from(reader.result as ArrayBuffer));
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    const {saveFrame} = useContext<IContainer>(ContainerContext).get<IFrameService>(TYPES.FrameService);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        Object.keys(formData).forEach((key) => {
            if (!formData[key as keyof FrameBaseModel]) {
                return;
            }
        });
        if (image.length === 0) {
            return;
        }
        saveFrame({
            ...formData,
            image,
        });
    }

    return (
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <label htmlFor="frameId">Название багета: </label>
                <input type="text" name="frameId" value={formData.frameId} onChange={handleFraimIdChange} />
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <label htmlFor="frameId">Размер багета (для покупателей): </label>
                <input type="number" name="frameSizeWidth" value={formData.frameSize.width} onChange={handleFrameSizeWidthChange} />
                <input type="number" name="frameSizeHeight" value={formData.frameSize.height} onChange={handleFrameSizeHeightChange} />
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <label htmlFor="frameId">Цена багета за метр: </label>

                <input type="number" name="price" value={formData.price} onChange={handlePriceChange} />
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <label htmlFor="frameId">Размер визуализации: </label>

                <input
                    type="number"
                    name="visualizationFrameSizeWidth"
                    value={formData.visualizationFrameSize.width}
                    onChange={handleVisualizationFrameSizeWidthChange}
                />
                <input
                    type="number"
                    name="visualizationFrameSizeHeight"
                    value={formData.visualizationFrameSize.height}
                    onChange={handleVisualizationFrameSizeHeightChange}
                />
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <label htmlFor="frameId">Фото визуализации: </label>
                <input type="file" name="image" onChange={handleImageChange} />
            </div>

            <button type="submit">Save</button>
        </form>
    );
}
