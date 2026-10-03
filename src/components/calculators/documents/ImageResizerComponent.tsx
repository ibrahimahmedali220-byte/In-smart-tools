import React, { useState, useEffect } from 'react';
import { FileUploadZone } from '../../common/FileUploadZone';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import {
  resizeImage,
  ImageResizeOptions,
  ImageResizeResult
} from '../../../utils/processors/imageResizer';
import { OutputFormat } from '../../../utils/processors/imageCompressor';
import { validateImageFile, formatFileSize } from '../../../utils/security/fileSecurity';
import { Download, RotateCcw, Lock, Unlock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DimensionPreset {
  label: string;
  width: number;
  height: number;
  description: string;
}

const SARKARI_RESIZE_PRESETS: DimensionPreset[] = [
  { label: 'UPSC Photo', width: 350, height: 350, description: '350 × 350 px' },
  { label: 'SSC Photo', width: 200, height: 230, description: '200 × 230 px' },
  { label: 'Govt Signature', width: 140, height: 60, description: '140 × 60 px' },
  { label: 'IBPS Passport', width: 200, height: 200, description: '200 × 200 px' }
];

export const ImageResizerComponent: React.FC = () => {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageResizeResult | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    const validation = await validateImageFile(selectedFile);
    if (!validation.isValid) {
      showToast(validation.error || 'Invalid image file.', 'error');
      return;
    }

    // Read natural dimensions
    const img = new Image();
    const url = URL.createObjectURL(selectedFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setFile(selectedFile);
      setResult(null);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('Could not load image dimensions.', 'error');
    };

    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (maintainRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (maintainRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const applyScalePercentage = (percent: number) => {
    if (originalWidth <= 0 || originalHeight <= 0) return;
    const factor = percent / 100;
    setTargetWidth(Math.round(originalWidth * factor));
    setTargetHeight(Math.round(originalHeight * factor));
  };

  const applyPreset = (preset: DimensionPreset) => {
    setMaintainRatio(false); // Presets have specific exact aspect ratios
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
  };

  const handleResize = async () => {
    if (!file) return;

    if (targetWidth <= 0 || targetHeight <= 0) {
      showToast('Please enter valid width and height dimensions.', 'error');
      return;
    }

    if (targetWidth > 8192 || targetHeight > 8192) {
      showToast('Maximum allowed dimensions are 8192 × 8192 pixels.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      if (result) {
        URL.revokeObjectURL(result.previewUrl);
      }
      const res = await resizeImage(file, {
        targetWidth,
        targetHeight,
        maintainAspectRatio: maintainRatio,
        outputFormat: format,
        quality: 0.90
      });
      setResult(res);
      showToast(`Resized to ${res.resizedWidth} × ${res.resizedHeight} px!`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Resize failed.', 'error');
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
          label="Upload Image to Resize"
          helperText="Resize photos and signatures to exact pixel dimensions required for job applications (e.g. UPSC, SSC, IBPS)."
          onFilesSelected={handleFileSelected}
        />
      )}

      {/* Resize Workspace */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 truncate max-w-xs">{file.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Original: {originalWidth} × {originalHeight} px ({formatFileSize(file.size)})
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Change File
              </Button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Sarkari Portal Dimension Presets</span>
              <div className="grid grid-cols-2 gap-2">
                {SARKARI_RESIZE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900 block">{preset.label}</span>
                    <span className="text-[11px] text-slate-500">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Scale Buttons */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 block">Quick Percentage Scale</span>
              <div className="flex items-center gap-1.5">
                {[25, 50, 75, 150].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyScalePercentage(pct)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Exact Dimension Inputs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Target Pixel Dimensions</span>
                <button
                  type="button"
                  onClick={() => setMaintainRatio(!maintainRatio)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  {maintainRatio ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium">Aspect Ratio Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-medium">Aspect Ratio Unlocked</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="resize-width" className="block text-[11px] text-slate-500 mb-1">
                    Width (Pixels)
                  </label>
                  <input
                    id="resize-width"
                    type="number"
                    min={10}
                    max={8192}
                    value={targetWidth || ''}
                    onChange={e => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="resize-height" className="block text-[11px] text-slate-500 mb-1">
                    Height (Pixels)
                  </label>
                  <input
                    id="resize-height"
                    type="number"
                    min={10}
                    max={8192}
                    value={targetHeight || ''}
                    onChange={e => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 block">Output Format</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/jpeg', name: 'JPG' },
                  { id: 'image/webp', name: 'WebP' },
                  { id: 'image/png', name: 'PNG' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id as OutputFormat)}
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

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleResize}
              isLoading={isProcessing}
            >
              Resize Image
            </Button>
          </div>

          {/* Right Preview & Download (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="space-y-2 text-center">
              <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-center min-h-[220px] max-h-[300px]">
                {result ? (
                  <img
                    src={result.previewUrl}
                    alt="Resized preview"
                    className="max-h-[260px] w-auto object-contain rounded shadow-sm"
                  />
                ) : (
                  <div className="text-xs text-slate-400">
                    Preview will update after clicking "Resize Image"
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">New Dimensions</span>
                    <span className="font-bold text-slate-900">{result.resizedWidth} × {result.resizedHeight} px</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">File Size</span>
                    <span className="font-bold text-slate-900">{formatFileSize(result.fileSizeBytes)}</span>
                  </div>
                </div>

                <a
                  href={result.previewUrl}
                  download={result.filename}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Resized Image
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
