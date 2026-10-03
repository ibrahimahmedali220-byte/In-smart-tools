import React, { useState } from 'react';
import { FileUploadZone } from '../../common/FileUploadZone';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import {
  loadPdfInfo,
  convertPdfToJpg,
  RenderedPageItem,
  PdfInfo
} from '../../../utils/processors/pdfToJpg';
import { validatePdfFile, formatFileSize } from '../../../utils/security/fileSecurity';
import { FileText, Download, RotateCcw, Image as ImageIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PdfToJpgComponent: React.FC = () => {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.5); // 1.5x standard
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [renderedPages, setRenderedPages] = useState<RenderedPageItem[]>([]);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const validation = await validatePdfFile(selectedFile);
    if (!validation.isValid) {
      showToast(validation.error || 'Invalid PDF file.', 'error');
      return;
    }

    try {
      const info = await loadPdfInfo(selectedFile);
      setFile(selectedFile);
      setPdfInfo(info);
      setStartPage(1);
      setEndPage(Math.min(info.numPages, 10)); // default first 10 pages max
      setRenderedPages([]);
    } catch {
      showToast('Could not load PDF document. File may be encrypted or corrupted.', 'error');
    }
  };

  const handleConvert = async () => {
    if (!file || !pdfInfo) return;

    setIsProcessing(true);
    setProgress(5);

    try {
      const pages = await convertPdfToJpg(
        file,
        {
          startPage,
          endPage,
          scale,
          quality: 0.85
        },
        (p) => setProgress(p)
      );

      setRenderedPages(pages);
      showToast(`Successfully converted ${pages.length} pages to JPG!`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to convert PDF pages.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = () => {
    renderedPages.forEach((page, index) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = page.dataUrl;
        a.download = page.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 250);
    });
    showToast(`Downloading all ${renderedPages.length} pages...`, 'info');
  };

  const handleReset = () => {
    renderedPages.forEach(p => URL.revokeObjectURL(p.dataUrl));
    setFile(null);
    setPdfInfo(null);
    setRenderedPages([]);
    setProgress(0);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {!file && renderedPages.length === 0 && (
        <FileUploadZone
          accept="application/pdf"
          maxSizeMB={50}
          label="Upload PDF Document"
          helperText="Select a PDF to extract its pages as high-resolution JPG images directly on your device."
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* Configuration Workspace */}
      {file && pdfInfo && renderedPages.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">{pdfInfo.filename}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatFileSize(pdfInfo.size)} · Total {pdfInfo.numPages} {pdfInfo.numPages === 1 ? 'Page' : 'Pages'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
              Change File
            </Button>
          </div>

          {/* Page Range Selection */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Pages to Convert</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pdf-start-page" className="block text-[11px] text-slate-500 mb-1">
                  From Page
                </label>
                <input
                  id="pdf-start-page"
                  type="number"
                  min={1}
                  max={pdfInfo.numPages}
                  value={startPage}
                  onChange={e => setStartPage(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label htmlFor="pdf-end-page" className="block text-[11px] text-slate-500 mb-1">
                  To Page
                </label>
                <input
                  id="pdf-end-page"
                  type="number"
                  min={startPage}
                  max={pdfInfo.numPages}
                  value={endPage}
                  onChange={e => setEndPage(Math.min(pdfInfo.numPages, Math.max(startPage, parseInt(e.target.value, 10) || startPage)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Converting {Math.max(1, endPage - startPage + 1)} pages (Page {startPage} to {endPage})
            </p>
          </div>

          {/* Resolution Scale */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 block">Image Quality / Resolution</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScale(1.5)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  scale === 1.5
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Standard Quality (1.5x)
              </button>
              <button
                type="button"
                onClick={() => setScale(2.0)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  scale === 2.0
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                High Quality (2.0x)
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {isProcessing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Rendering pages to JPG...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-900 h-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Convert Action */}
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleConvert}
            isLoading={isProcessing}
            icon={<ImageIcon className="w-4 h-4" />}
          >
            Extract JPG Images
          </Button>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p>Local rendering: Pages are rendered directly onto an off-screen canvas without server upload.</p>
          </div>
        </div>
      )}

      {/* Converted Pages Gallery */}
      {renderedPages.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/90">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Converted Pages ({renderedPages.length})
              </h2>
              <p className="text-xs text-slate-500">
                Download individual page JPGs or restart
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={handleDownloadAll} icon={<Download className="w-3.5 h-3.5" />}>
                Download All ({renderedPages.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Convert Another PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {renderedPages.map(page => (
              <div
                key={page.pageNumber}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="p-3 bg-slate-100/60 flex items-center justify-center min-h-[220px]">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="max-h-[200px] w-auto object-contain rounded shadow-sm border border-slate-200"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Page {page.pageNumber}</span>
                    <span className="text-slate-500 font-mono">{formatFileSize(page.blob.size)}</span>
                  </div>

                  <a
                    href={page.dataUrl}
                    download={page.filename}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Page {page.pageNumber}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
