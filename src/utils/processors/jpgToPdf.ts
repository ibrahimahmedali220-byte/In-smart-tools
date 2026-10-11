/**
 * Client-Side JPG/PNG/WebP to PDF Processing Engine
 * Generates a clean, optimized PDF document from one or multiple images using pdf-lib.
 * 100% In-Browser execution without remote server transfer.
 */

import { PDFDocument, PageSizes } from 'pdf-lib';
import { sanitizeFilename } from '../security/fileSecurity';

export type PageOrientation = 'portrait' | 'landscape' | 'auto';
export type PageSizeOption = 'a4' | 'letter' | 'fit';

export interface ImageToPdfOptions {
  orientation: PageOrientation;
  pageSize: PageSizeOption;
  margin: number; // in points (e.g. 10 or 20)
  customFilename?: string;
}

export interface ImageInputItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

export async function convertImagesToPdf(
  items: ImageInputItem[],
  options: ImageToPdfOptions,
  onProgress?: (percent: number) => void
): Promise<{ blob: Blob; filename: string }> {
  if (items.length === 0) {
    throw new Error('Please select at least one image to convert.');
  }

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const imageBytes = await item.file.arrayBuffer();

    let embeddedImage;
    try {
      if (item.file.type === 'image/jpeg' || item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg')) {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      } else if (item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png')) {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      } else {
        // For WebP or other images, draw onto an off-screen canvas and export as PNG bytes
        const pngBlob = await convertFileToPngBlob(item.file);
        const pngBytes = await pngBlob.arrayBuffer();
        embeddedImage = await pdfDoc.embedPng(pngBytes);
      }
    } catch (embedErr) {
      console.warn(`Direct embed failed for "${item.name}", falling back to canvas re-encoding:`, embedErr);
      try {
        const pngBlob = await convertFileToPngBlob(item.file);
        const pngBytes = await pngBlob.arrayBuffer();
        embeddedImage = await pdfDoc.embedPng(pngBytes);
      } catch (fallbackErr) {
        console.error(`Canvas fallback also failed for "${item.name}":`, fallbackErr);
        throw new Error(`Failed to process image "${item.name}". Please ensure it is a valid JPG, PNG, or WebP file.`);
      }
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    // Determine target page width and height
    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === 'fit') {
      pageWidth = imgWidth + options.margin * 2;
      pageHeight = imgHeight + options.margin * 2;
    } else {
      const standardSize = options.pageSize === 'letter' ? PageSizes.Letter : PageSizes.A4;
      let isLandscape = options.orientation === 'landscape';
      if (options.orientation === 'auto') {
        isLandscape = imgWidth > imgHeight;
      }

      pageWidth = isLandscape ? standardSize[1] : standardSize[0];
      pageHeight = isLandscape ? standardSize[0] : standardSize[1];
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Scale image to fit inside available printable area
    const printableWidth = pageWidth - options.margin * 2;
    const printableHeight = pageHeight - options.margin * 2;

    const scale = Math.min(printableWidth / imgWidth, printableHeight / imgHeight, 1);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / items.length) * 100));
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

  // Generate clean download name (custom name or derived from first image)
  let downloadName: string;
  if (options.customFilename && options.customFilename.trim().length > 0) {
    const raw = options.customFilename.trim();
    const withExt = raw.toLowerCase().endsWith('.pdf') ? raw : `${raw}.pdf`;
    downloadName = sanitizeFilename(withExt, 'converted_document.pdf');
  } else {
    const firstBase = items[0].name.replace(/\.[^/.]+$/, '');
    downloadName = sanitizeFilename(`${firstBase}_converted.pdf`, 'images_converted.pdf');
  }

  return { blob, filename: downloadName };
}

/**
 * Helper to convert arbitrary image formats (like WebP) to PNG blob via Canvas
 */
async function convertFileToPngBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('Canvas conversion unavailable in non-browser environment'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width || 800;
        const height = img.naturalHeight || img.height || 600;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            // Data URL fallback
            try {
              const dataUrl = canvas.toDataURL('image/png');
              const parts = dataUrl.split(',');
              const byteString = atob(parts[1]);
              const mimeString = parts[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              resolve(new Blob([ab], { type: mimeString }));
            } catch (fallbackErr) {
              reject(fallbackErr);
            }
          }
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image file "${file.name}" for conversion`));
    };

    img.src = url;
  });
}
