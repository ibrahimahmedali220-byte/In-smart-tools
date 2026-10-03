/**
 * Client-Side Image Resizer Engine
 * Resizes images to exact pixel dimensions or percentage scales via HTML5 Canvas.
 */

import { sanitizeFilename } from '../security/fileSecurity';
import { OutputFormat } from './imageCompressor';

export interface ImageResizeOptions {
  targetWidth: number;
  targetHeight: number;
  maintainAspectRatio: boolean;
  outputFormat: OutputFormat;
  quality?: number; // 0.1 to 1.0 (default 0.90)
}

export interface ImageResizeResult {
  blob: Blob;
  previewUrl: string;
  originalWidth: number;
  originalHeight: number;
  resizedWidth: number;
  resizedHeight: number;
  fileSizeBytes: number;
  filename: string;
}

export async function resizeImage(
  file: File,
  options: ImageResizeOptions
): Promise<ImageResizeResult> {
  const width = Math.max(1, Math.min(8192, Math.round(options.targetWidth)));
  const height = Math.max(1, Math.min(8192, Math.round(options.targetHeight)));
  const format = options.outputFormat || 'image/jpeg';
  const quality = options.quality || 0.90;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      // If converting to JPEG, fill white background
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      // Smooth bicubic/bilinear scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Failed to resize image'));
            return;
          }

          const fileSizeBytes = blob.size;
          const previewUrl = URL.createObjectURL(blob);

          let ext = 'jpg';
          if (format === 'image/png') ext = 'png';
          else if (format === 'image/webp') ext = 'webp';

          const baseName = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''), 'image');
          const filename = `${baseName}_${width}x${height}.${ext}`;

          resolve({
            blob,
            previewUrl,
            originalWidth,
            originalHeight,
            resizedWidth: width,
            resizedHeight: height,
            fileSizeBytes,
            filename
          });
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = objectUrl;
  });
}
