import { type Sharp } from "sharp";
import { toPixels, luminance } from "./util.js";
import type Color from "./Color.js";
import type { GenericOpts } from "./index.js";

const _map = ' .`^",:;Il!i><~+_-?][}{1)(|\\x*#MW&8%B@$';

export interface AsciiOptions extends GenericOpts {
    /**
     * String of ascii characters to use, in order from dimmest to brightest
     * @default ' .`^",:;Il!i><~+_-?][}{1)(|\\x*#MW&8%B@$'
     */
    charMap: string;
    /**
     * Reverse the charmap (bright pixels will be represented with dim characters)
     * @default false
     */
    reverse: boolean;
}

export default async function ascii(img: Sharp, w: number, h: number, color: Color, opts?: Partial<AsciiOptions>): Promise<string> {
    const raw = await toPixels(img.resize(w, h));
    let map =  opts?.charMap || _map;
    if (opts?.reverse) map = map.split('').toReversed().join('');
    const unit = 255 / map.length;
    let str = '';
    for (const row of raw) {
        for (const px of row) {
            const ch = map.charAt(Math.max(0, Math.min(Math.round(luminance(px[0], px[1], px[2]) / unit), map.length - 1)));
            str += `${color.parse({r: px[0], g: px[1], b: px[2]}, false)}${ch}\x1b[0m`;
        }
        str += '\n';
    }
    return str;
}