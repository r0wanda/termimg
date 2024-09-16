import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import Color from "./Color.js";
import { type BlockOptions } from './block.js';
import { type HalfblockOptions } from './halfblock.js';
import { type AsciiOptions } from './ascii.js';
import { type BrailleOptions } from './braille.js';

export type Backends = 'block' | 'halfblock' | 'ascii' | 'braille' | 'kitty' | 'sixel' | 'auto';

type SharpTypes = Buffer | ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array | Float64Array | string | URL;

const color = new Color();
const noColor = new Color(2);

let block: typeof import('./block.js').default, halfblock: typeof import('./halfblock.js').default,
    ascii: typeof import('./ascii.js').default, braille: typeof import('./braille.js').default,
    kitty: typeof import('./kitty.js').default, sixel: typeof import('./sixel.js').default;

export interface GenericOpts {
    /**
     * Whether to use color
     * If false, color won't be used
     * If true, a default Color instance will be used
     * If a Color instance is provided, it will be used
     */
    color: Color | boolean;
}

export interface AutoOptions extends GenericOpts {
    /**
     * List of backends to choose from, in order from highest to lowest priority.
     * The highest priority backend that is supported and not excluded will be chosen
     * @default ['kitty', 'sixel', 'halfblock', 'block', 'braille', 'ascii']
     */
    backends: Backends[];
    /**
     * Backend(s) to exclude
     */
    exclude: Backends | Backends[];
    /**
     * Use graphical backends (kitty and sixel)
     * @default true
     */
    useGraphics: boolean;
}

export default async function termimg(data: SharpTypes, w: number, h: number, backend: 'sixel', opts?: Partial<BrailleOptions>): Promise<string>
export default async function termimg(data: SharpTypes, w: number, h: number, backend: 'braille', opts?: Partial<BrailleOptions>): Promise<string>
export default async function termimg(data: SharpTypes, w: number, h: number, backend: 'ascii', opts?: Partial<AsciiOptions>): Promise<string>
export default async function termimg(data: SharpTypes, w: number, h: number, backend: 'halfblock', opts?: Partial<HalfblockOptions>): Promise<string>
export default async function termimg(data: SharpTypes, w: number, h: number, backend: 'block', opts?: Partial<BlockOptions>): Promise<string>
export default async function termimg(data: SharpTypes, w: number, h: number, backend: 'auto', opts?: Partial<AutoOptions>): Promise<string>
export default async function termimg(data: SharpTypes, w: number, h: number, backend: Backends = 'auto', opts?: Partial<GenericOpts>): Promise<string> {
    if (typeof data === 'string' || (data instanceof URL)) data = await readFile(data);
    let colorInstance;
    if (typeof opts?.color === 'boolean' && !opts.color) {
        colorInstance = noColor;
    } else if (opts?.color instanceof Color) {
        colorInstance = opts.color;
    } else {
        colorInstance = color;
    }
    const img = sharp(data).toColorspace('srgb');
    switch (backend) {
        case 'block':
            if (!block) block = (await import('./block.js')).default;
            return await block(img, w, h, colorInstance, <Partial<BlockOptions>>opts);
        case 'halfblock':
            if (!halfblock) halfblock = (await import('./halfblock.js')).default;
            return await halfblock(img, w, h, colorInstance, <Partial<HalfblockOptions>>opts);
        case 'ascii':
            if (!ascii) ascii = (await import('./ascii.js')).default;
            return await ascii(img, w, h, colorInstance, <Partial<AsciiOptions>>opts);
        case 'braille':
            if (!braille) braille = (await import('./braille.js')).default;
            return await braille(img, w, h, colorInstance);
        case 'sixel':
            if (!sixel) sixel = (await import('./sixel.js')).default;
            return await sixel(img, w, h);
    }
    return '';
}