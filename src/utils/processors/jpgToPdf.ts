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

  // Generate clean download name
  const firstBase = items[0].name.replace(/\.[^/.]+$/, '');
  const downloadName = sanitizeFilename(`${firstBase}_converted.pdf`, 'images_converted.pdf');

  return { blob, filename: downloadName };
}

/**
 * Helper to convert arbitrary image formats (like WebP) to PNG blob via Canvas
 */
async function convertFileToPngBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert image to PNG'));
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for PDF conversion'));
    };

    img.src = url;
  });
}
