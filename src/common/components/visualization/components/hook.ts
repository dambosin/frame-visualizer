import {FrameViewModel} from '@/common/services/frame-service/types';
import {Rectangle} from '@/common/types';

type UseCanvasProps = {
    canvas: HTMLCanvasElement | null;
};

type UseCanvasReturn = {
    drawImage: (image: HTMLImageElement, frameSize: Rectangle) => void;
    drawFrame: (frame: FrameViewModel) => void;
    clear: () => void;
    save: () => void;
};

type Coordinates = {
    x: number;
    y: number;
};

export function useCanvas({canvas}: UseCanvasProps): UseCanvasReturn {
    function calculateImageCenterPosition(canvasSize: Rectangle): Coordinates {
        return {
            x: canvasSize.width / 2,
            y: (canvasSize.height - getFooterSquareSide(canvasSize.width)) / 2,
        };
    }

    function fitImageInFrame(imageSize: Rectangle, frameSize: Rectangle): Rectangle {
        const imageRatio = imageSize.width / imageSize.height;
        const frameRatio = frameSize.width / frameSize.height;
        let res: Rectangle;
        if (imageRatio <= frameRatio) {
            res = {
                width: frameSize.width,
                height: frameSize.width / imageRatio,
            };
        } else {
            res = {
                width: frameSize.height * imageRatio,
                height: frameSize.height,
            };
        }
        return res;
    }

    function getFooterSquareSide(width: number): number {
        return width / 2;
    }

    function getImageSourceValues(
        imageSize: Rectangle,
        adjustedImageSize: Rectangle,
        frameSize: Rectangle
    ): {
        sx: number;
        sy: number;
        sw: number;
        sh: number;
    } {
        const originalToAdjustedRatio = imageSize.width / adjustedImageSize.width;
        const offsetX = ((adjustedImageSize.width - frameSize.width) * originalToAdjustedRatio) / 2;
        const offsetY = ((adjustedImageSize.height - frameSize.height) * originalToAdjustedRatio) / 2;
        const width = frameSize.width * originalToAdjustedRatio;
        const height = frameSize.height * originalToAdjustedRatio;

        return {
            sx: offsetX,
            sy: offsetY,
            sw: width,
            sh: height,
        };
    }
    function drawImage(image: HTMLImageElement, frameSizeInit: Rectangle) {
        const frameSize: Rectangle = {
            width: frameSizeInit.width * 5,
            height: frameSizeInit.height * 5,
        };
        if (canvas) {
            console.log('hook drawImage');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const imageCenterPosition = calculateImageCenterPosition({width: canvas.width, height: canvas.height});
                console.log('hook drawImage 2', imageCenterPosition, canvas);
                const adjustedImageSize = fitImageInFrame({width: image.width, height: image.height}, frameSize);
                ctx.translate(imageCenterPosition.x, imageCenterPosition.y);
                const {sx, sy, sw, sh} = {
                    ...getImageSourceValues({width: image.width, height: image.height}, adjustedImageSize, frameSize),
                };
                ctx.fillStyle = 'black';
                ctx.drawImage(image, sx, sy, sw, sh, -frameSize.width / 2, -frameSize.height / 2, frameSize.width, frameSize.height);
                ctx.translate(-imageCenterPosition.x, -imageCenterPosition.y);
            }
        }
    }

    function drawFrame(frame: FrameViewModel) {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.onload = () => {
                function clip(localRect: Rectangle, numberOfEdges = 4, frameDrawModel: FrameViewModel) {
                    if (ctx) {
                        const delta =
                            (Math.tan(((360 / numberOfEdges / 2) * Math.PI) / 180) * frameDrawModel.visualizationFrameSize.height) / 2;
                        ctx.beginPath();
                        ctx.moveTo(-localRect.width / 2 - delta, -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height / 2);
                        ctx.lineTo(localRect.width / 2 + delta, -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height / 2);
                        ctx.lineTo(localRect.width / 2, -localRect.height / 2);
                        ctx.lineTo(-localRect.width / 2, -localRect.height / 2);
                        ctx.lineTo(-localRect.width / 2 - delta, -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height / 2);
                        ctx.clip();
                    }
                }
                function drawFrameSide(localRect: Rectangle, numberOfEdges: number = 4, edge: number = 0, frameDrawModel: FrameViewModel) {
                    if (ctx) {
                        ctx.save();
                        const pos: Coordinates = {
                            x: -localRect.width / 2 - frameDrawModel.visualizationFrameSize.width / 2,
                            y: -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height / 2,
                        };
                        ctx.rotate((2 / numberOfEdges) * edge * Math.PI);
                        clip(localRect, numberOfEdges, frameDrawModel);
                        while (pos.x < localRect.width / 2 + frameDrawModel.visualizationFrameSize.width / 2) {
                            ctx.drawImage(
                                image,
                                pos.x,
                                pos.y,
                                frameDrawModel.visualizationFrameSize.width / 2,
                                frameDrawModel.visualizationFrameSize.height / 2
                            );
                            pos.x += frameDrawModel.visualizationFrameSize.width / 2;
                        }
                        ctx.restore();
                    }
                }
                const numberOfEdges = 4;
                if (canvas && ctx) {
                    const imageCenterPosition = calculateImageCenterPosition({width: canvas.width, height: canvas.height});
                    ctx.translate(imageCenterPosition.x, imageCenterPosition.y);
                }
                for (let i = 0; i < numberOfEdges; i++) {
                    drawFrameSide({width: 250, height: 250}, numberOfEdges, i, frame);
                }
            };
            image.src = `data:image/jpeg;base64,${frame.image}`;
        }
    }

    return {
        drawImage,
        drawFrame,
        clear: () => {
            throw new Error('Method not implemented.');
        },
        save: () => {
            throw new Error('Method not implemented.');
        },
    };
}
