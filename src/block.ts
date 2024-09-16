import { type Sharp } from "sharp";
import { toPixels, luminance } from "./util.js";
import type Color from "./Color.js";
import type { GenericOpts } from "./index.js";

const full = '█';
const dark = '▓';
const mid = '▒';
const light = '░';

export interface BlockChars extends GenericOpts {
    /**
     * Full brightness/opacity character
     * @default '█'
     */
    full: string;
    /**
     * 3/4 brightness/opacity character
     * @default '▓'
     */
    dark: string;
    /**
     * Half brightness/opacity character
     * @default '▒'
     */
    mid: string;
    /**
     * Low brightness/opacity character
     * @default '░'
     */
    light: string;
}
export interface BlockOptions extends BlockChars {
    /**
     * Exclusively use this character
     * @remarks Takes priority over any other options (type, luminance, etc...)
     */
    char: string;
    /**
     * Exclusively use one type of char (eg. full, dark, mid, light)
     */
    type: 'full' | 'dark' | 'mid' | 'light';
    /**
     * Use the alpha channel to determine which character to use (if alpha is available)
     * @default true
     */
    alpha: boolean;
    /**
     * Use luminance to determine which character to use (instead of alpha if available)
     * @default false
     */
    luminance: boolean;
}

export default async function block(img: Sharp, w: number, h: number, color: Color, _opts?: Partial<BlockOptions>): Promise<string> {
    const raw = await toPixels(img.resize(w, h));
    if (!_opts) _opts = {};
    const opts = {
        full: _opts.full || full,
        dark: _opts.dark || dark,
        mid: _opts.mid || mid,
        light: _opts.light || light,
        char: _opts.char,
        type: _opts.type,
        alpha: _opts.alpha ?? true,
        luminance: _opts.luminance ?? false
    }
    let str = '';
    for (const row of raw) {
        for (const px of row) {
            let ch = opts.char || (opts.type ? opts[opts.type] : null) || opts.full;
            if (!opts.char && !opts.type && (opts.luminance || (opts.alpha && px[3] !== undefined))) {
                const a = opts.luminance ? luminance(px[0], px[1], px[2]) : px[3] ?? 255;
                if (a < 64) ch = opts?.light || light;
                else if (a < 128) ch = opts?.mid || mid;
                else if (a < 191) ch = opts?.dark || dark;
            }
            str += `${color.parse({r: px[0], g: px[1], b: px[2]}, false)}${ch}\x1b[0m`;
        }
        str += '\n';
    }
    return str;
}