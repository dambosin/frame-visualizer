import React, {FC, ReactNode} from 'react';
import {MemoizedTextInput} from '../input/TextInput';
import {InputProps} from '../input/types';
import {MemoizedNumberInput} from '../input/NumberInput';
import {MemoizedRectInput} from '../input/RectInput';
import {MemoizedFileInput} from '../input/FileInput';
import './LabelHOC.css';
import {Rectangle} from '@/common/types';

type LabelProps = {
    direction?: 'row' | 'column';
    label: string | ReactNode;
    hideInput?: boolean;
};

function withLabel<T extends unknown = string>(WrappedInput: FC<InputProps<T>>) {
    return function LabelHoc({label, direction = 'column', hideInput = false, ...otherProps}: InputProps<T> & LabelProps) {
        return (
            <div className={`label-hoc label-hoc_${direction}`}>
                <label htmlFor={otherProps.id}>{label}</label>
                <WrappedInput {...otherProps} hidden={hideInput} />
            </div>
        );
    };
}

export const TextInputWithLabel = withLabel<string>(MemoizedTextInput);
export const NumberInputWithLabel = withLabel<number>(MemoizedNumberInput);
export const RectInputWithLabel = withLabel<Rectangle>(MemoizedRectInput);
export const FileInputWithLabel = withLabel<File>(MemoizedFileInput);
