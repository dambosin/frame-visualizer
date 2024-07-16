import {FrameViewModel} from '@/common/services/frame-service/types';
import {Rectangle} from '@/common/types';

type UseCanvasProps = {
    canvas: HTMLCanvasElement | null;
};

type UseCanvasReturn = {
    drawImage: (image: HTMLImageElement, frameSize: Rectangle, frame: FrameViewModel) => void;
    drawFrame: (frame: FrameViewModel, frameSize: Rectangle) => void;
    clear: () => void;
    save: (linkId: string, fileName: string) => void;
};

type Coordinates = {
    x: number;
    y: number;
};

export function useCanvas({canvas}: UseCanvasProps): UseCanvasReturn {
    const baseFactor = 15;
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

    function calcFactor(frameSizeInit: Rectangle): number {
        const padding = 200;
        if (canvas) {
            const baseSize = {width: frameSizeInit.width * baseFactor, height: frameSizeInit.height * baseFactor};
            let factor1 = baseFactor;
            let factor2 = baseFactor;
            if (canvas.width < baseSize.width + padding) {
                factor1 = Math.floor(((canvas.width - padding) / frameSizeInit.width) * 100) / 100;
            }
            if (canvas.height < baseSize.height + padding + canvas.width / 2) {
                factor2 = Math.floor(((canvas.height - padding - canvas.width / 2) / frameSizeInit.height) * 100) / 100;
            }
            if (frameSizeInit.width < 30) {
                factor1 = Math.floor(((30 * baseFactor) / frameSizeInit.width) * 100) / 100;
            }
            if (frameSizeInit.height < 40) {
                factor2 = Math.floor(((40 * baseFactor) / frameSizeInit.height) * 100) / 100;
            }
            const factor = Math.min(factor1, factor2);
            console.log('factor is', factor1, factor2);
            return factor;
        }

        return 0;
    }

    function drawImage(image: HTMLImageElement, frameSizeInit: Rectangle, frame: FrameViewModel) {
        function drawShadow(localRect: Rectangle, frameDrawModel: FrameViewModel, ctx: CanvasRenderingContext2D) {
            if (canvas && ctx) {
                ctx.save();
                const imageCenterPosition = calculateImageCenterPosition({width: canvas.width, height: canvas.height});
                ctx.translate(imageCenterPosition.x, imageCenterPosition.y);

                ctx.beginPath();
                ctx.moveTo(
                    localRect.width / 2 + frameDrawModel.visualizationFrameSize.height,
                    -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height
                );
                ctx.lineTo(
                    localRect.width / 2 + frameDrawModel.visualizationFrameSize.height + 1000,
                    -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height + 1000
                );
                ctx.lineTo(
                    -localRect.width / 2 - frameDrawModel.visualizationFrameSize.height + 1000,
                    localRect.height / 2 + frameDrawModel.visualizationFrameSize.height + 1000
                );
                ctx.lineTo(
                    -localRect.width / 2 - frameDrawModel.visualizationFrameSize.height,
                    localRect.height / 2 + frameDrawModel.visualizationFrameSize.height
                );
                ctx.lineTo(
                    localRect.width / 2 + frameDrawModel.visualizationFrameSize.height,
                    -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height
                );
                ctx.clip();
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 50;
                ctx.fillRect(
                    -localRect.width / 2 - frameDrawModel.visualizationFrameSize.height,
                    -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height,
                    localRect.width + frameDrawModel.visualizationFrameSize.height * 2,
                    localRect.height + frameDrawModel.visualizationFrameSize.height * 2
                );
                ctx.restore();
            }
        }
        if (canvas) {
            const factor = calcFactor(frameSizeInit);
            const frameSize: Rectangle = {
                width: frameSizeInit.width * factor,
                height: frameSizeInit.height * factor,
            };
            console.log('hook drawImage');
            const ctx = canvas.getContext('2d');
            const frameFactor = factor / 10;
            if (ctx) {
                drawShadow(
                    frameSize,
                    {
                        ...frame,
                        visualizationFrameSize: {
                            width: frame.visualizationFrameSize.width * frameFactor,
                            height: frame.visualizationFrameSize.height * frameFactor,
                        },
                    },
                    ctx
                );
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
                function clip(localRect: Rectangle, numberOfEdges = 4, frameDrawModel: FrameViewModel, shadow: boolean = false) {
                    if (ctx) {
                        const delta = Math.tan(((360 / numberOfEdges / 2) * Math.PI) / 180) * frameDrawModel.visualizationFrameSize.height;
                        if (shadow) {
                            ctx.shadowColor = 'black';
                            ctx.shadowBlur = 40;
                            ctx.fillRect(
                                -localRect.width / 2 - frameDrawModel.visualizationFrameSize.height,
                                -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height,
                                (localRect.width / 2 + frameDrawModel.visualizationFrameSize.height) * 2,
                                30
                            );
                            ctx.shadowBlur = 0;
                        } else {
                            ctx.beginPath();
                            ctx.moveTo(-localRect.width / 2 - delta, -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height);
                            ctx.lineTo(localRect.width / 2 + delta, -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height);
                            ctx.lineTo(localRect.width / 2, -localRect.height / 2);
                            ctx.lineTo(-localRect.width / 2, -localRect.height / 2);
                            ctx.lineTo(-localRect.width / 2 - delta, -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height);
                            ctx.clip();
                        }
                    }
                }
                function drawFrameSide(localRect: Rectangle, numberOfEdges: number = 4, edge: number = 0, frameDrawModel: FrameViewModel) {
                    if (ctx) {
                        ctx.save();
                        const pos: Coordinates = {
                            x: -localRect.width / 2 - frameDrawModel.visualizationFrameSize.width,
                            y: -localRect.height / 2 - frameDrawModel.visualizationFrameSize.height,
                        };
                        ctx.rotate((2 / numberOfEdges) * edge * Math.PI);
                        clip(localRect, numberOfEdges, frameDrawModel);
                        while (pos.x < localRect.width / 2 + frameDrawModel.visualizationFrameSize.width) {
                            ctx.drawImage(
                                image,
                                pos.x,
                                pos.y,
                                frameDrawModel.visualizationFrameSize.width,
                                frameDrawModel.visualizationFrameSize.height
                            );
                            pos.x += frameDrawModel.visualizationFrameSize.width;
                        }
                        ctx.restore();
                    }
                }

                function calcPrice(frame: FrameViewModel): string {
                    const additionalFrameLength = (frame.visualizationFrameSize.height * 8) / 10;
                    const perimeter = (frameSizeInit.width + frameSizeInit.height) * 2;
                    const sum = additionalFrameLength + perimeter;
                    const finalPrice = Math.ceil(frame.price * sum) / 100;
                    return finalPrice.toString() + ' BYN';
                }

                function drawFooter() {
                    if (canvas && ctx) {
                        const width = getFooterSquareSide(canvas.width);
                        ctx.fillStyle = 'rgb(59, 42, 37)';
                        ctx.fillRect(0, canvas.height - width, width, width);
                        ctx.fillStyle = 'white';
                        const fontSize = 96;
                        ctx.font = `${fontSize}px serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        const metrics = ctx.measureText(calcPrice(frame));
                        console.log(metrics);
                        ctx.textBaseline = 'alphabetic';
                        ctx.fillText(
                            calcPrice(frame),
                            width / 2,
                            canvas.height - width / 2 + (metrics.hangingBaseline - metrics.alphabeticBaseline) / 2
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
                    const factor = calcFactor(frameSizeInit);
                    const frameFactor = factor / 10;
                    let frameSize: Rectangle = {
                        width: frameSizeInit.width * factor,
                        height: frameSizeInit.height * factor,
                    };
                    const imageCenterPosition = calculateImageCenterPosition({width: canvas.width, height: canvas.height});
                    ctx.translate(imageCenterPosition.x, imageCenterPosition.y);
                    for (let i = 0; i < numberOfEdges; i++) {
                        drawFrameSide(frameSize, numberOfEdges, i, {
                            ...frame,
                            visualizationFrameSize: {
                                width: frame.visualizationFrameSize.width * frameFactor,
                                height: frame.visualizationFrameSize.height * frameFactor,
                            },
                        });
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
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
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
