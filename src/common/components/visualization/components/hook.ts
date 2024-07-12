import {FrameViewModel} from '@/common/services/frame-service/types';
import {Rectangle} from '@/common/types';

type UseCanvasProps = {
    canvas: HTMLCanvasElement | null;
};

type UseCanvasReturn = {
    drawImage: (image: HTMLImageElement, frameSize: Rectangle) => void;
    drawFrame: (frame: FrameViewModel, frameSize: Rectangle) => void;
    clear: () => void;
    save: (linkId: string, fileName: string) => void;
};

type Coordinates = {
    x: number;
    y: number;
};

export function useCanvas({canvas}: UseCanvasProps): UseCanvasReturn {
    const factor = 15;
    const frameFactor = factor / 10;
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
            width: frameSizeInit.width * factor,
            height: frameSizeInit.height * factor,
        };
        if (canvas) {
            console.log('hook drawImage');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const imageCenterPosition = calculateImageCenterPosition({width: canvas.width, height: canvas.height});
                console.log('hook drawImage 2', imageCenterPosition, canvas);
                const adjustedImageSize = fitImageInFrame({width: image.width, height: image.height}, frameSize);
                ctx.save();
                ctx.translate(imageCenterPosition.x, imageCenterPosition.y);
                const {sx, sy, sw, sh} = {
                    ...getImageSourceValues({width: image.width, height: image.height}, adjustedImageSize, frameSize),
                };
                ctx.fillStyle = 'black';
                ctx.drawImage(image, sx, sy, sw, sh, -frameSize.width / 2, -frameSize.height / 2, frameSize.width, frameSize.height);
                ctx.restore();
            }
        }
    }

    function drawFrame(frame: FrameViewModel, frameSizeInit: Rectangle) {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.onload = () => {
                function rotateRect(rect: Rectangle): Rectangle {
                    return {
                        width: rect.height,
                        height: rect.width,
                    };
                }
                function clip(localRect: Rectangle, numberOfEdges = 4, frameDrawModel: FrameViewModel) {
                    if (ctx) {
                        const delta =
                            Math.tan(((360 / numberOfEdges / 2) * Math.PI) / 180) *
                            frameDrawModel.visualizationFrameSize.height *
                            frameFactor;
                        ctx.beginPath();
                        ctx.moveTo(
                            -localRect.width / 2 - delta,
                            -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height * frameFactor
                        );
                        ctx.lineTo(
                            localRect.width / 2 + delta,
                            -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height * frameFactor
                        );
                        ctx.lineTo(localRect.width / 2, -localRect.height / 2);
                        ctx.lineTo(-localRect.width / 2, -localRect.height / 2);
                        ctx.lineTo(
                            -localRect.width / 2 - delta,
                            -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height * frameFactor
                        );
                        ctx.clip();
                    }
                }
                function drawFrameSide(localRect: Rectangle, numberOfEdges: number = 4, edge: number = 0, frameDrawModel: FrameViewModel) {
                    if (ctx) {
                        ctx.save();
                        const pos: Coordinates = {
                            x: -localRect.width / 2 - frameDrawModel.visualizationFrameSize.width * frameFactor,
                            y: -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height * frameFactor,
                        };
                        ctx.rotate((2 / numberOfEdges) * edge * Math.PI);
                        clip(localRect, numberOfEdges, frameDrawModel);
                        while (pos.x < localRect.width / 2 + frameDrawModel.visualizationFrameSize.width * frameFactor) {
                            ctx.drawImage(
                                image,
                                pos.x,
                                pos.y,
                                frameDrawModel.visualizationFrameSize.width * frameFactor,
                                frameDrawModel.visualizationFrameSize.height * frameFactor
                            );
                            pos.x += frameDrawModel.visualizationFrameSize.width * frameFactor;
                        }
                        ctx.restore();
                    }
                }

                function drawFooter() {
                    if (canvas && ctx) {
                        const width = getFooterSquareSide(canvas.width);
                        ctx.fillStyle = 'rgb(59, 42, 37)';
                        ctx.fillRect(0, canvas.height - width, width, width);
                        ctx.fillStyle = 'white';
                        const fontSize = 96;
                        ctx.font = `${fontSize}px serif`;
                        ctx.textBaseline = 'middle';
                        ctx.fillText(
                            frame.price.toString(),
                            width / 2 - fontSize.toString().length * factor * 2,
                            canvas.height - width / 2
                        );
                        ctx.drawImage(
                            image,
                            (image.width - image.height) / 2,
                            0,
                            image.height,
                            image.height,
                            width,
                            canvas.height - width,
                            width,
                            width
                        );
                    }
                }
                const numberOfEdges = 4;
                if (canvas && ctx) {
                    let frameSize: Rectangle = {
                        width: frameSizeInit.width * factor,
                        height: frameSizeInit.height * factor,
                    };
                    const imageCenterPosition = calculateImageCenterPosition({width: canvas.width, height: canvas.height});
                    ctx.translate(imageCenterPosition.x, imageCenterPosition.y);
                    for (let i = 0; i < numberOfEdges; i++) {
                        drawFrameSide(frameSize, numberOfEdges, i, frame);
                        frameSize = rotateRect(frameSize);
                    }
                    ctx.translate(-imageCenterPosition.x, -imageCenterPosition.y);
                    drawFooter();
                }
            };
            image.src = `data:image/jpeg;base64,${frame.image}`;
        }
    }

    function clear() {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    function save(linkId: string, fileName: string) {
        if (canvas) {
            const link = document.getElementById(linkId);
            if (link) {
                link.setAttribute('download', fileName + '.png');
                link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
                link.click();
            }
        }
    }

    return {
        drawImage,
        drawFrame,
        clear,
        save,
    };
}
