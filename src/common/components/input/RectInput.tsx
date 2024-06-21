import React from 'react';
import {InputProps} from './types';
import {MemoizedNumberInput} from './NumberInput';
import {RectSize} from '@/common/rect';

function RectInput({id, value, onChange}: InputProps<RectSize>) {
    function handleReverseClick() {
        onChange({width: value.height, height: value.width});
    }

    function handleHeightChange(height: number) {
        onChange({...value, height});
    }

    function handleWidthChange(width: number) {
        onChange({...value, width});
    }

    return (
        <>
            <MemoizedNumberInput id={id} value={value.width} onChange={handleWidthChange} />
            <img src="UNO-Reverse-Card-PNG-Images-HD.png" width={32} onClick={handleReverseClick} style={{marginTop: 'auto'}} />
            <MemoizedNumberInput id={id + '-height'} value={value.height} onChange={handleHeightChange} />
        </>
    );
}

export const MemoizedRectInput = React.memo(RectInput);
