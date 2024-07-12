import {Rectangle} from '@/common/types';
import classes from '../VisualizationForm.module.css';
import Image from 'next/image';

type VisualizationSizeInputProps = {
    visualizationSize: Rectangle;
    onChange: (value: Rectangle) => void;
    error?: string;
};

export function VisualizationSizeInput({visualizationSize, onChange, error}: VisualizationSizeInputProps) {
    function handleWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            onChange({...visualizationSize, width: value});
        }
    }

    function handleHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            onChange({...visualizationSize, height: value});
        }
    }

    function handleSwapClick() {
        const newRect = {
            width: visualizationSize.height,
            height: visualizationSize.width,
        };
        onChange(newRect);
    }

    return (
        <div className={classes.input}>
            <label htmlFor="size-input" className={classes.form__label}>
                <span>Размер:</span>
            </label>
            <input
                id="size-input"
                type="number"
                value={visualizationSize.width}
                onChange={handleWidthChange}
                className={classes.size__input}
            />
            <Image
                src="/reverse.png"
                width="32"
                height="21"
                alt={'Change width and height'}
                className={classes.size__reverse}
                onClick={handleSwapClick}
            />
            <input type="number" value={visualizationSize.height} onChange={handleHeightChange} className={classes.size__input} />
            {error ? <span className={classes.form__error}>{error}</span> : null}
        </div>
    );
}
