import React from 'react';
import classes from './FrameCard.module.css';
import Image from 'next/image';
type FrameCardProps = {
    price: number;
    img?: string;
    selected?: boolean;
    onClick?: () => void;
};

export function FrameCard({img, price, selected = false, onClick}: FrameCardProps) {
    return (
        <div
            className={`${classes.frameCard} ${onClick ? classes.frameCard_pointer : ''} ${selected ? classes.frameCard_selected : ''}`}
            onClick={onClick}
        >
            {img ? (
                <Image className={classes.frameCard__img} src={`data:image/jpeg;base64,${img}`} width={100} height={80} alt="frame" />
            ) : (
                <div className={classes.frameCard__img + ' ' + classes.frameCard__img_empty}></div>
            )}
            <p className={classes.frameCard__price}>{price}</p>
        </div>
    );
}

export const MemoizedFrameCard = React.memo(FrameCard);
