import React, { useState } from 'react';
import { FileUploadZone } from '../../common/FileUploadZone';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { compressPdf, CompressionLevel, PdfCompressionResult } from '../../../utils/processors/pdfCompressor';
import { validatePdfFile, formatFileSize } from '../../../utils/security/fileSecurity';
import { FileText, Download, RotateCcw, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

export const PdfCompressorComponent: React.FC = () => {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<PdfCompressionResult & { url: string } | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const validation = await validatePdfFile(selectedFile);
    if (!validation.isValid) {
      showToast(validation.error || 'Invalid PDF file.', 'error');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(15);

    try {
      const res = await compressPdf(file, level, p => setProgress(p));
      const url = URL.createObjectURL(res.blob);
      setResult({ ...res, url });
      showToast('PDF compressed successfully!', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to compress PDF.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result.url);
    }
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {!file && !result && (
        <FileUploadZone
          accept="application/pdf"
          maxSizeMB={50}
          label="Upload PDF to Compress"
          helperText="Select a PDF document to reduce file size for job portals, emails, or exam submissions."
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* Configuration Box */}
      {file && !result && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 max-w-lg mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 truncate max-w-xs">{file.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Original Size: <span className="font-semibold text-slate-900">{formatFileSize(file.size)}</span>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
              Change File
            </Button>
          </div>

          {/* Compression Level Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Compression Strength</span>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as CompressionLevel[]).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                    level === l
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {l === 'low' ? 'Standard' : l === 'medium' ? 'Balanced' : 'Aggressive'}
                </button>
              ))}
            </div>
          </div>

          {/* Honest Messaging Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              Compression results depend on the contents of your PDF. Documents containing heavy uncompressed images will see significant reduction, while text-heavy vectors are already compact.
            </p>
          </div>

          {/* Progress bar */}
          {isProcessing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Optimizing PDF object dictionaries...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-900 h-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleCompress}
            isLoading={isProcessing}
            icon={<FileText className="w-4 h-4" />}
          >
            Compress PDF
          </Button>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p>100% In-Browser: Compression executes locally via client-side object re-encoding. Zero network transfer.</p>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center max-w-lg mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Compression Complete!</h2>
            <p className="text-xs text-slate-500 font-mono">{result.filename}</p>
          </div>

          {/* Size Comparison */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <div>
              <span className="text-[11px] text-slate-500 block">Original Size</span>
              <span className="text-sm font-bold text-slate-700 line-through">
                {formatFileSize(result.originalSizeBytes)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">New Size</span>
              <span className="text-sm font-bold text-emerald-600">
                {formatFileSize(result.compressedSizeBytes)}
              </span>
            </div>
            {result.percentReduction > 0 && (
              <div className="col-span-2 pt-2 border-t border-slate-200 text-xs font-semibold text-slate-800">
                Saved {result.percentReduction}% of total file size
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={result.url}
              download={result.filename}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Compressed PDF
            </a>

            <Button variant="outline" size="md" onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
              Compress Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
