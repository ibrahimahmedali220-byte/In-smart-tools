/**
 * Client-Side Image Compressor Engine
 * Compresses JPG, PNG, and WebP images directly via HTML5 Canvas in browser memory.
 */

import { sanitizeFilename } from '../security/fileSecurity';

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageCompressionOptions {
  quality: number; // 0.1 to 1.0 (e.g. 0.70)
  targetFormat?: OutputFormat;
  maxDimension?: number; // optionally downscale if dimensions exceed limit
}

export interface ImageCompressionResult {
  blob: Blob;
  previewUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  percentReduction: number;
  width: number;
  height: number;
  filename: string;
}

export async function compressImage(
  file: File,
  options: ImageCompressionOptions
): Promise<ImageCompressionResult> {
  const originalSizeBytes = file.size;
  const quality = Math.max(0.05, Math.min(1.0, options.quality));
  const format = options.targetFormat || (file.type as OutputFormat) || 'image/jpeg';

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // Downscale if exceeds max dimension
      if (options.maxDimension && (width > options.maxDimension || height > options.maxDimension)) {
        if (width > height) {
          height = Math.round((height * options.maxDimension) / width);
          width = options.maxDimension;
        } else {
          width = Math.round((width * options.maxDimension) / height);
          height = options.maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      // If converting to JPEG, paint white background to avoid transparent black artifact
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const compressedSizeBytes = blob.size;
          const rawReduction = ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100;
          const percentReduction = Math.max(0, Math.round(rawReduction * 10) / 10);
          const previewUrl = URL.createObjectURL(blob);

          // Build clean extension
          let ext = 'jpg';
          if (format === 'image/png') ext = 'png';
          else if (format === 'image/webp') ext = 'webp';

          const baseName = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''), 'image');
          const filename = `${baseName}_compressed.${ext}`;

          resolve({
            blob,
            previewUrl,
            originalSizeBytes,
            compressedSizeBytes,
            percentReduction,
            width,
            height,
            filename
          });
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image file'));
    };

    img.src = objectUrl;
  });
}
