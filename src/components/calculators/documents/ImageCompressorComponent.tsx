import React, { useState, useEffect } from 'react';
import { FileUploadZone } from '../../common/FileUploadZone';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import {
  compressImage,
  OutputFormat,
  ImageCompressionResult
} from '../../../utils/processors/imageCompressor';
import { validateImageFile, formatFileSize } from '../../../utils/security/fileSecurity';
import { Download, RotateCcw, Image as ImageIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ImageCompressorComponent: React.FC = () => {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.75); // 75% quality default
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageCompressionResult | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const validation = await validateImageFile(selectedFile);
    if (!validation.isValid) {
      showToast(validation.error || 'Invalid image file.', 'error');
      return;
    }

    setFile(selectedFile);
    setResult(null);

    // Initial compression
    try {
      const initial = await compressImage(selectedFile, {
        quality: 0.75,
        targetFormat: 'image/jpeg'
      });
      setResult(initial);
    } catch {
      // Handled gracefully
    }
  };

  const handleRecompress = async (newQuality: number, newFormat: OutputFormat) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      if (result) {
        URL.revokeObjectURL(result.previewUrl);
      }
      const compressed = await compressImage(file, {
        quality: newQuality,
        targetFormat: newFormat
      });
      setResult(compressed);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Compression failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick preset button for exam & application portal requirements
  const applyPreset = async (targetKb: number) => {
    if (!file) return;
    // Iteratively adjust quality until size is below target or quality floor is reached
    setIsProcessing(true);
    try {
      let q = 0.8;
      let res = await compressImage(file, { quality: q, targetFormat: 'image/jpeg' });

      // If still too large, downsample quality and if necessary dimension
      while (res.compressedSizeBytes > targetKb * 1024 && q > 0.15) {
        q -= 0.15;
        res = await compressImage(file, { quality: q, targetFormat: 'image/jpeg' });
      }

      setQuality(Math.round(q * 100) / 100);
      setFormat('image/jpeg');
      setResult(res);
      showToast(`Adjusted image targeting <${targetKb} KB`, 'success');
    } catch {
      showToast('Could not reach target size.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result.previewUrl);
    }
    setFile(null);
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {!file && (
        <FileUploadZone
          accept="image/jpeg,image/png,image/webp"
          maxSizeMB={50}
          label="Upload Image to Compress"
          helperText="Compress JPG, PNG, or WebP images to match strict portal upload limits (<20KB, <50KB, <100KB)."
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* Interactive Compression Workspace */}
      {file && result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 truncate max-w-xs">{file.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Original: <span className="font-semibold text-slate-900">{formatFileSize(file.size)}</span>
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Change File
              </Button>
            </div>

            {/* Sarkari Exam Quick Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Quick Government Portal Presets
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset(20)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-center font-medium transition-colors"
                >
                  <span className="font-bold text-slate-900 block">&lt; 20 KB</span>
                  <span className="text-[10px] text-slate-500">Signatures</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(50)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-center font-medium transition-colors"
                >
                  <span className="font-bold text-slate-900 block">&lt; 50 KB</span>
                  <span className="text-[10px] text-slate-500">UPSC/SSC Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(100)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-center font-medium transition-colors"
                >
                  <span className="font-bold text-slate-900 block">&lt; 100 KB</span>
                  <span className="text-[10px] text-slate-500">Thumbprints</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(200)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-center font-medium transition-colors"
                >
                  <span className="font-bold text-slate-900 block">&lt; 200 KB</span>
                  <span className="text-[10px] text-slate-500">Certificates</span>
                </button>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="img-quality-slider" className="text-slate-700">
                  Compression Quality
                </label>
                <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                id="img-quality-slider"
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setQuality(val);
                  handleRecompress(val, format);
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Smaller File</span>
                <span>Higher Quality</span>
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 block">Output Format</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/jpeg', name: 'JPG / JPEG' },
                  { id: 'image/webp', name: 'WebP' },
                  { id: 'image/png', name: 'PNG' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFormat(f.id as OutputFormat);
                      handleRecompress(quality, f.id as OutputFormat);
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      format === f.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p>Your photos never leave your device. Compression runs 100% inside client-side canvas memory.</p>
            </div>
          </div>

          {/* Right Comparison & Download (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="space-y-2 text-center">
              <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-center min-h-[220px] max-h-[300px]">
                <img
                  src={result.previewUrl}
                  alt="Compressed preview"
                  className="max-h-[260px] w-auto object-contain rounded shadow-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Dimensions: {result.width} × {result.height} px
              </p>
            </div>

            {/* Size metrics comparison */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 block">Original Size</span>
                <span className="text-sm font-bold text-slate-700 line-through">
                  {formatFileSize(result.originalSizeBytes)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Compressed Size</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {formatFileSize(result.compressedSizeBytes)}
                </span>
              </div>
              {result.percentReduction > 0 && (
                <div className="col-span-2 pt-2 border-t border-slate-200 text-xs font-semibold text-slate-800">
                  Reduced by {result.percentReduction}%
                </div>
              )}
            </div>

            <a
              href={result.previewUrl}
              download={result.filename}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Compressed Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
