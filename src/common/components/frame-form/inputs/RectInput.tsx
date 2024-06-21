import React from 'react';
import {RectInputWithLabel} from '@/common/components/input-label/LabelHOC';
import {Rectangle} from '@/common/types';

type RectInputProps = {
    error?: string;
    value: Rectangle;
    onChange: (value: Rectangle) => void;
};

export function RectInput({error, value, onChange}: RectInputProps) {
    return (
        <>
            <RectInputWithLabel direction="row" label="Размер: " id="frame-form-rect" value={value} onChange={onChange} />
            {error ? <p style={{color: 'red'}}>{error}</p> : null}
        </>
    );
}

export const MemoizedRectInput = React.memo(RectInput);
