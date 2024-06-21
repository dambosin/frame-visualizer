import React from 'react';
import {FileInputWithLabel} from '../../input-label/LabelHOC';
import Image from 'next/image';

type FileInputProps = {
    error?: string;
    onChange: (value: File) => void;
};

export function FileInput({error, onChange}: FileInputProps) {
    return (
        <>
            <FileInputWithLabel
                id="frame-form__file-input"
                label={
                    <div className={'frame-form__file-input'}>
                        <h2>Выбор файла</h2>
                        <Image src="file-upload-icon.svg" width="64" height="64" className={'frame-form__file-input-image'} alt={''} />
                    </div>
                }
                onChange={onChange}
                hideInput
            />
            {error ? <p style={{color: 'red'}}>{error}</p> : null}
        </>
    );
}

export const MemoizedFileInput = React.memo(FileInput);
