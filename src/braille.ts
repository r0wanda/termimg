import { type Sharp } from "sharp";
import { Braille } from "braillelib";
import { toPixels, luminance } from "./util.js";
import type Color from "./Color.js";
import type { GenericOpts } from "./index.js";

export interface BrailleOptions extends GenericOpts {
    /**
     * The threshold to determine whether or not a pixel should be colored in, based on luminance
     * @default 90
     */
    threshold: number;
}

export default async function braille(img: Sharp, w: number, h: number, color: Color, opts?: Partial<BrailleOptions>): Promise<string> {
    const pxImg = img.resize(w * 2, h * 4);
    const raw = await toPixels(pxImg);
    const cImg = pxImg.resize(w, h);
    const rawC = await toPixels(cImg);
    let threshold = Number(opts?.threshold ?? 90);
    if (isNaN(threshold)) threshold = 90;
    let str = '';
    let cache: Braille[] = [];
    for (let y = 0; y < raw.length; y++) {
        for (let x = 0; x < raw[y].length; x++) {
            const px = raw[y][x];
            const i = Math.floor(x / 2);
            if (!cache[i]) {
                cache.push(new Braille(8));
            }
            cache[i].xy(x % 2, y % 4, luminance(px[0], px[1], px[2]) >= threshold);
        }
        if ((y + 1) % 4 === 0) {
            const cY = (y + 1) / 4 - 1;
            for (let cX = 0; cX < cache.length; cX++) {
                const px = rawC[cY][cX];
                str += `${color.parse({r: px[0], g: px[1], b: px[2]}, false)}${cache[cX].ch}\x1b[0m`;
            }
            str += '\n';
            cache = [];
        }
    }
    return str;
}
