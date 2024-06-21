import React from 'react';
import './FrameCard.css';
import Image from 'next/image';
type FrameCardProps = {
    price: number;
    img?: string;
    selected?: boolean;
    onClick?: () => void;
};

export function FrameCard({img, price, selected = false, onClick}: FrameCardProps) {
    return (
        <div className={`frame-card ${onClick ? 'frame-card_pointer' : ''} ${selected ? 'frame-card_selected' : ''}`} onClick={onClick}>
            {img ? (
                <Image className="frame-card__img" src={`data:image/jpeg;base64,${img}`} width={64} height={64} alt="frame" />
            ) : (
                <div className="frame-card__img frame-card__img_empty"></div>
            )}
            <p className="frame-card__price">{price}</p>
        </div>
    );
}

export const MemoizedFrameCard = React.memo(FrameCard);
