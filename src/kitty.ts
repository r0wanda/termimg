import { type Sharp } from "sharp";
import { toPixels } from "./util.js";
import type Color from "./Color.js";

const full = '█';
const dark = '▓';
const mid = '▒';
const light = '░';

export default async function block(img: Sharp, w: number, h: number, color: Color): Promise<string> {
    const raw = await toPixels(img.resize(w, h));
    let str = '';
    for (const row of raw) {
        for (const px of row) {
            let ch = full;
            if (px[3] !== undefined) {
                const a = px[3];
                if (a < 64) ch = light;
                else if (a < 128) ch = mid;
                else if (a < 191) ch = dark;
            }
            str += `${color.parse({r: px[0], g: px[1], b: px[2]}, false)}${ch}\x1b[0m`;
        }
        str += '\n';
    }
    return str;
}