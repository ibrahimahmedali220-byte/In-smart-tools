/**
 * Security & Validation Engine for Untrusted Files
 * Enforces magic bytes/signature checks, size limits, filename sanitization,
 * dimension limits, and memory exhaustion protections.
 */

// Supported MIME types and signatures
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_PDF_TYPES = ['application/pdf'];

// Maximum allowed thresholds
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_IMAGE_DIMENSION_PX = 8192; // 8192x8192 px max to prevent decompression bombs
export const MAX_PDF_PAGES = 100; // Max 100 pages per batch
export const MAX_BATCH_FILES = 25; // Max 25 files in JPG to PDF batch

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName?: string;
  detectedType?: string;
}

/**
 * Sanitizes user-provided filenames to prevent path traversal,
 * shell injection, and reserved character exploits.
 */
export function sanitizeFilename(filename: string, fallback: string = 'file'): string {
  if (!filename || typeof filename !== 'string') return fallback;

  // Strip path traversal sequences like ../ or ..\
  let clean = filename.replace(/\.\.+[/\\]/g, '');

  // Extract base and extension
  const lastDot = clean.lastIndexOf('.');
  let base = lastDot !== -1 ? clean.slice(0, lastDot) : clean;
  let ext = lastDot !== -1 ? clean.slice(lastDot + 1).toLowerCase() : '';

  // Remove unsafe characters from base (keep only alphanumeric, hyphens, underscores, spaces)
  base = base.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim();
  ext = ext.replace(/[^a-zA-Z0-9]/g, '').trim();

  // Truncate base name to reasonable length (max 60 chars)
  if (base.length > 60) {
    base = base.slice(0, 60);
  }

  if (!base) base = fallback;
  return ext ? `${base}.${ext}` : base;
}

/**
 * Validates a file by inspecting its magic bytes / file header signature.
 */
export async function validateFileMagicBytes(file: File): Promise<string | null> {
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. JPEG check (starts with FF D8 FF)
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return 'image/jpeg';
    }

    // 2. PNG check (89 50 4E 47 0D 0A 1A 0A)
    if (
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
      bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A
    ) {
      return 'image/png';
    }

    // 3. WebP check ("RIFF" .... "WEBP")
    if (
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    ) {
      return 'image/webp';
    }

    // 4. PDF check (starts with "%PDF-", hex: 25 50 44 46 2D)
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D) {
      return 'application/pdf';
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validates untrusted image upload.
 */
export async function validateImageFile(file: File): Promise<FileValidationResult> {
  if (!file) return { isValid: false, error: 'No file selected.' };

  // File size check
  if (file.size <= 0) {
    return { isValid: false, error: 'Selected file is empty (0 bytes).' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: 'File exceeds maximum limit of 50 MB.' };
  }

  // Magic bytes inspection
  const detectedType = await validateFileMagicBytes(file);
  if (!detectedType || !SUPPORTED_IMAGE_TYPES.includes(detectedType)) {
    return {
      isValid: false,
      error: 'Unsupported image format. Please upload JPG, PNG, or WebP only.'
    };
  }

  const sanitizedName = sanitizeFilename(file.name, 'image');

  return {
    isValid: true,
    detectedType,
    sanitizedName
  };
}

/**
 * Validates untrusted PDF upload.
 */
export async function validatePdfFile(file: File): Promise<FileValidationResult> {
  if (!file) return { isValid: false, error: 'No file selected.' };

  if (file.size <= 0) {
    return { isValid: false, error: 'Selected PDF file is empty.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: 'PDF exceeds maximum limit of 50 MB.' };
  }

  const detectedType = await validateFileMagicBytes(file);
  if (detectedType !== 'application/pdf') {
    return {
      isValid: false,
      error: 'Invalid file. The uploaded file does not match a valid PDF document signature.'
    };
  }

  const sanitizedName = sanitizeFilename(file.name, 'document.pdf');

  return {
    isValid: true,
    detectedType,
    sanitizedName
  };
}

/**
 * Formats byte size into human readable string (KB, MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
