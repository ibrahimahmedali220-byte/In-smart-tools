import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Creates a valid uncompressed/deflated RGBA PNG buffer
 */
function createPng(width: number, height: number, renderPixel: (x: number, y: number) => [number, number, number, number]): Buffer {
  // Raw scanlines: each line starts with filter byte 0 (None), then width * 4 bytes RGBA
  const rawBytes = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawBytes[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderPixel(x, y);
      rawBytes[offset++] = r;
      rawBytes[offset++] = g;
      rawBytes[offset++] = b;
      rawBytes[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawBytes, { level: 9 });

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to build a chunk
  function makeChunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);

    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(body), 0);

    return Buffer.concat([len, body, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression method 0
  ihdr.writeUInt8(0, 11); // filter method 0
  ihdr.writeUInt8(0, 12); // no interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Standard CRC32 table for PNG chunk checksums
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf: Buffer): number {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

/**
 * Geometric brand renderer for India Smart Tools
 * Slate #0f172a background, clean white tool wrench & gear mark, #38bdf8 accent dot
 */
function renderBrandIcon(size: number, isMaskable: boolean): Buffer {
  const radius = isMaskable ? 0 : Math.round(size * 0.22); // Rounded rect for standard, full bleed for maskable
  const cx = size / 2;
  const cy = size / 2;

  // Scale factor: maskable icons get an extra 15% inner safe margin
  const scale = isMaskable ? (size * 0.65) / 32 : (size * 0.75) / 32;

  return createPng(size, size, (x, y) => {
    // 1. Check outer rounded rectangle mask if not maskable
    if (!isMaskable) {
      const dx = Math.max(0, Math.abs(x - cx) - (cx - radius));
      const dy = Math.max(0, Math.abs(y - cy) - (cy - radius));
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) {
        return [0, 0, 0, 0]; // Transparent outside corner
      }
    }

    // Normalized coordinates relative to center (in 32x32 design space)
    const nx = (x - cx) / scale + 16;
    const ny = (y - cy) / scale + 16;

    // Background color: Deep Slate Navy (#0f172a = 15, 23, 42)
    let r = 15, g = 23, b = 42, a = 255;

    // Accent Dot: #38bdf8 (56, 189, 248) at (22, 22), radius 2.6
    const dotDist = Math.sqrt((nx - 22) ** 2 + (ny - 22) ** 2);
    if (dotDist <= 2.6) {
      const edge = Math.max(0, Math.min(1, 2.6 - dotDist + 0.5));
      return [
        Math.round(56 * edge + 15 * (1 - edge)),
        Math.round(189 * edge + 23 * (1 - edge)),
        Math.round(248 * edge + 42 * (1 - edge)),
        255
      ];
    }

    // Wrench Head & Caliper Handle Geometry
    // Handle line from (10, 20) to (16, 14) with width 3.0
    const lx1 = 9.5, ly1 = 19.5, lx2 = 16.5, ly2 = 12.5;
    const ldx = lx2 - lx1, ldy = ly2 - ly1;
    const lenSq = ldx * ldx + ldy * ldy;
    const t = Math.max(0, Math.min(1, ((nx - lx1) * ldx + (ny - ly1) * ldy) / lenSq));
    const projX = lx1 + t * ldx;
    const projY = ly1 + t * ldy;
    const handleDist = Math.sqrt((nx - projX) ** 2 + (ny - projY) ** 2);

    // Handle end cap at (8.5, 20.5)
    const capDist = Math.sqrt((nx - 8.5) ** 2 + (ny - 20.5) ** 2);

    // Wrench head outer circle at (14.5, 10.5) radius 5.2, cut out center radius 2.5
    const headDist = Math.sqrt((nx - 14.5) ** 2 + (ny - 10.5) ** 2);
    const inHeadCut = Math.abs(nx - 14.5) < 1.8 && (ny < 10.5);

    let isMark = false;
    if (capDist <= 2.2) isMark = true;
    if (handleDist <= 1.8) isMark = true;
    if (headDist <= 5.2 && headDist >= 2.0 && !inHeadCut) isMark = true;

    if (isMark) {
      r = 255;
      g = 255;
      b = 255;
    }

    return [r, g, b, a];
  });
}

// Generate all standard PWA and Apple touch icons
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating high-fidelity PWA icons in /public...');

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), renderBrandIcon(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), renderBrandIcon(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), renderBrandIcon(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), renderBrandIcon(180, false));

console.log('Icons generated successfully:');
console.log('- public/pwa-192x192.png');
console.log('- public/pwa-512x512.png');
console.log('- public/pwa-maskable-512x512.png');
console.log('- public/apple-touch-icon.png');
