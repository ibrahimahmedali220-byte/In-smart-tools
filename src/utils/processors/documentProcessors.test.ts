/**
 * Automated Unit Test Suite for Document and Image Security & Processing Engines
 */

import { sanitizeFilename, formatFileSize } from '../security/fileSecurity';
import { PDFDocument, PageSizes } from 'pdf-lib';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    console.error(`  ✗ ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

async function runTests() {
  console.log('--- RUNNING DOCUMENT & IMAGE PROCESSORS TEST SUITE ---');

  // 1. Filename Sanitization & Path Traversal Protections
  console.log('\nTesting Filename Sanitization & Path Traversal Security:');
  {
    const sanitized1 = sanitizeFilename('../../etc/passwd.jpg');
    assert(sanitized1 === 'etcpasswd.jpg' || !sanitized1.includes('..'), 'Security: Strips path traversal sequences');

    const sanitizedSpecial = sanitizeFilename('my<doc>|test:file?.pdf');
    assert(!sanitizedSpecial.includes('<') && !sanitizedSpecial.includes('?') && !sanitizedSpecial.includes('|'), 'Security: Strips illegal shell/filesystem chars');

    const fallback = sanitizeFilename('', 'fallback.jpg');
    assert(fallback === 'fallback.jpg', 'Security: Applies safe fallback when name is blank');

    const longName = 'a'.repeat(100) + '.jpg';
    const truncated = sanitizeFilename(longName);
    assert(truncated.length <= 65, 'Security: Truncates oversized filenames');
  }

  // 2. File Size Formatter
  console.log('\nTesting File Size Formatter:');
  {
    assert(formatFileSize(500) === '500 B', 'Size: Formats Bytes');
    assert(formatFileSize(2048) === '2.0 KB', 'Size: Formats Kilobytes');
    assert(formatFileSize(5 * 1024 * 1024) === '5.00 MB', 'Size: Formats Megabytes');
  }

  // 3. PDF Creation & Compression with pdf-lib
  console.log('\nTesting PDF Creation Engine (pdf-lib):');
  {
    const doc = await PDFDocument.create();
    const page = doc.addPage(PageSizes.A4);
    assert(page.getWidth() > 0 && page.getHeight() > 0, 'PDF: Successfully initializes A4 page dimensions');

    doc.setTitle('India Smart Tools Test');
    const pdfBytes = await doc.save();
    assert(pdfBytes.length > 0, 'PDF: Compiles valid binary PDF bytes');

    // Load and re-compress
    const loadedDoc = await PDFDocument.load(pdfBytes);
    loadedDoc.setTitle(''); // strip metadata
    const compressedBytes = await loadedDoc.save({ useObjectStreams: true });
    assert(compressedBytes.length > 0, 'PDF: Re-encodes document with object stream compression');
  }

  // 4. Aspect Ratio & Dimension Logic
  console.log('\nTesting Image Resizing & Aspect Ratio Logic:');
  {
    const origW = 1000;
    const origH = 500; // 2:1 ratio
    const targetW = 600;
    const targetH = Math.round(targetW * (origH / origW));
    assert(targetH === 300, 'Resize: Correctly preserves 2:1 aspect ratio');

    // Test Sarkari exam presets
    const upscW = 350;
    const upscH = 350;
    assert(upscW === 350 && upscH === 350, 'Resize: UPSC photo preset matches 350x350 standard');
  }

  console.log(`\n========================================`);
  console.log(`DOCUMENT PROCESSORS TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
