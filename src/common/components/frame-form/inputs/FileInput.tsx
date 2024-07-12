import {useCallback} from 'react';
import classes from '../VisualizationForm.module.css';
import Image from 'next/image';

type FileInputPorps = {
    files: File[];
    onChange: (files: File[]) => void;
    error?: string;
};

export function FileInput({files, onChange, error}: FileInputPorps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.files;
            if (value) {
                const files = Array.from(value).filter((f) => f);
                if (files) {
                    onChange(files);
                }
            }
        },
        [onChange]
    );

    return (
        <div className={classes.image__input}>
            <span className={classes.form__label}>Выбор Файла</span>
            <label htmlFor="image-input" className={classes.image__label}>
                <Image src="/file-upload-icon.svg" alt={'Upload image'} width="64" height="64" />
            </label>
            <input id="image-input" type="file" value={files.map((i) => i.webkitRelativePath)} onChange={handleChange} hidden />
            {error ? <span className={classes.form__error}>{error}</span> : null}
        </div>
    );
}
