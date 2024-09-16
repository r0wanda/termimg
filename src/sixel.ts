import { type Sharp } from "sharp";
import { image2sixel as im2six } from 'sixel';

export default async function sixel(img: Sharp, w: number, h: number): Promise<string> {
    const buf = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    return im2six(new Uint8ClampedArray(buf.data), buf.info.width, buf.info.height);
}