import { type Sharp } from "sharp";
import { toPixels } from "./util.js";
import type Color from "./Color.js";
import type { GenericOpts } from "./index.js";

const half = '▀';

export interface HalfblockOptions extends GenericOpts {
    /**
     * Character to use
     * @default '▀'
     */
    char: string;
    /**
     * When using the default character the foreground color is displayed on top
     * If you customize the character used then this can be used if required
     * @default false
     */
    invert: boolean;
}

export default async function halfblock(img: Sharp, w: number, h: number, color: Color, opts?: Partial<HalfblockOptions>): Promise<string> {
    const raw = await toPixels(img.resize(w, h * 2));
    let str = '';
    let halfrow = [];
    const invert = !!opts?.invert;
    const char = opts?.char || half;
    for (const row of raw) {
        if (halfrow.length < 1) {
            for (const px of row) {
                halfrow.push(color.parse({r: px[0], g: px[1], b: px[2]}, invert));
            }
        } else {
            for (let i = 0; i < row.length; i++) {
                const px = row[i];
                str += `${halfrow[i]}${color.parse({r: px[0], g: px[1], b: px[2]}, !invert)}${char}\x1b[0m`
            }
            str += '\n';
            halfrow = [];
        }
    }
    return str;
}