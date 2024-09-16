import { type Sharp } from "sharp";

type RGB = [number, number, number];
type RGBA = [number, number, number, number];
type PixelsRGB = RGB[][];
type PixelsRGBA = RGBA[][];
export type Pixels = PixelsRGB | PixelsRGBA

export async function toPixels(img: Sharp) {
    const { data, info } = await img.raw({ depth: 'uchar' }).toBuffer({ resolveWithObject: true });
    const pxs: Pixels = [];
    let i = 0;
    for (let y = 0; y < info.height; y++) {
        const row: RGB[] & RGBA[] = [];
        for (let x = 0; x < info.width; x++) {
            const px = [];
            for (let ch = 0; ch < info.channels; ch++) {
                px.push(data[i]);
                i++;
            }
            row.push(<RGB & RGBA>px);
        }
        pxs.push(row);
    }
    return pxs;
}

export function luminance(r: number, g: number, b: number) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}
