import React, {ChangeEvent, InputHTMLAttributes, useCallback} from 'react';
import {InputProps} from './types';

function NumberInput({value, onChange, id}: InputProps<number>) {
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                const value = Number(e.target.value);
                if (isNaN(value)) {
                    throw new Error('Value is not a number: value - ' + e.target.value);
                }
                onChange(value);
            }
        },
        [onChange]
    );
    return <input id={id} type="number" onChange={handleChange} value={value} />;
}

export const MemoizedNumberInput = React.memo(NumberInput);
