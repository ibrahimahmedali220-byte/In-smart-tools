/**
 * Client-Side PDF to JPG Converter
 * Renders pages safely onto HTML5 Canvas using pdfjs-dist.
 * Script execution is disabled (isEvalSupported: false) to protect against untrusted PDF payloads.
 */

import { sanitizeFilename } from '../security/fileSecurity';

let pdfjsLibPromise: Promise<typeof import('pdfjs-dist')> | null = null;

async function getPdfJs(): Promise<typeof import('pdfjs-dist')> {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import('pdfjs-dist').then(lib => {
      if (typeof window !== 'undefined' && !lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
      }
      return lib;
    });
  }
  return pdfjsLibPromise;
}

export interface RenderedPageItem {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
  filename: string;
  width: number;
  height: number;
}

export interface PdfInfo {
  numPages: number;
  filename: string;
  size: number;
}

export async function loadPdfInfo(file: File): Promise<PdfInfo> {
  const pdfjsLib = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true
  });

  const pdf = await loadingTask.promise;
  return {
    numPages: pdf.numPages,
    filename: file.name,
    size: file.size
  };
}

export async function convertPdfToJpg(
  file: File,
  options: {
    startPage: number;
    endPage: number;
    scale?: number; // 1.5 default
    quality?: number; // 0.85 default
  },
  onProgress?: (percent: number, currentPage: number) => void
): Promise<RenderedPageItem[]> {
  const pdfjsLib = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const start = Math.max(1, Math.min(options.startPage, numPages));
  const end = Math.min(numPages, Math.max(start, options.endPage));
  const scale = options.scale || 1.5;
  const quality = options.quality || 0.85;

  const totalToRender = end - start + 1;
  const results: RenderedPageItem[] = [];

  const baseName = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''), 'document');

  for (let pageNum = start; pageNum <= end; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas rendering context unavailable');
    }

    // Render page
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas
    };

    await page.render(renderContext).promise;

    // Export canvas to JPEG blob
    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        b => {
          if (b) resolve(b);
          else reject(new Error(`Failed to convert page ${pageNum} to JPG`));
        },
        'image/jpeg',
        quality
      );
    });

    const dataUrl = URL.createObjectURL(blob);
    const pageFilename = `${baseName}_page_${pageNum}.jpg`;

    results.push({
      pageNumber: pageNum,
      blob,
      dataUrl,
      filename: pageFilename,
      width: Math.round(viewport.width),
      height: Math.round(viewport.height)
    });

    const completed = results.length;
    if (onProgress) {
      onProgress(Math.round((completed / totalToRender) * 100), pageNum);
    }
  }

  return results;
}
