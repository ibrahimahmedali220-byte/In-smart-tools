import React, { useState } from 'react';
import { FileUploadZone } from '../../common/FileUploadZone';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import {
  convertImagesToPdf,
  ImageInputItem,
  PageOrientation,
  PageSizeOption
} from '../../../utils/processors/jpgToPdf';
import { validateImageFile, formatFileSize } from '../../../utils/security/fileSecurity';
import { FileText, Download, RotateCcw, Trash2, ArrowUp, ArrowDown, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const JpgToPdfComponent: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<ImageInputItem[]>([]);
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedPdf, setGeneratedPdf] = useState<{ url: string; filename: string; size: number } | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const validItems: ImageInputItem[] = [];

    for (const file of files) {
      const validation = await validateImageFile(file);
      if (!validation.isValid) {
        showToast(validation.error || 'Invalid image file.', 'error');
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      validItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: validation.sanitizedName || file.name,
        size: file.size,
        previewUrl
      });
    }

    if (validItems.length > 0) {
      setItems(prev => [...prev, ...validItems]);
      setGeneratedPdf(null);
    }
  };

  const handleRemove = (id: string) => {
    const target = items.find(i => i.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setItems(items.filter(i => i.id !== id));
  };

  const handleClearAll = () => {
    items.forEach(i => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
    if (generatedPdf) {
      URL.revokeObjectURL(generatedPdf.url);
      setGeneratedPdf(null);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleConvert = async () => {
    if (items.length === 0) {
      showToast('Please upload at least one image.', 'error');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const result = await convertImagesToPdf(
        items,
        {
          orientation,
          pageSize,
          margin: pageSize === 'fit' ? 0 : 20
        },
        p => setProgress(p)
      );

      const url = URL.createObjectURL(result.blob);
      setGeneratedPdf({
        url,
        filename: result.filename,
        size: result.blob.size
      });
      showToast('PDF created successfully!', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to generate PDF.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {items.length === 0 && !generatedPdf && (
        <FileUploadZone
          accept="image/jpeg,image/png,image/webp"
          multiple
          maxSizeMB={50}
          label="Upload JPG, PNG or WebP Images"
          helperText="Select one or multiple images to compile into a single organized PDF document."
          onFilesSelected={handleFilesSelected}
        />
      )}

      {/* Workspace when images are loaded */}
      {items.length > 0 && !generatedPdf && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Reorderable Thumbnails & Image List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Selected Images ({items.length})
                </h2>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">
                  {formatFileSize(items.reduce((acc, curr) => acc + curr.size, 0))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileUploadZone
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  label="Add More"
                  onFilesSelected={handleFilesSelected}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Image Items List */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatFileSize(item.size)} · Page {idx + 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === items.length - 1}
                      className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Layout Options & Action (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Page Configuration
              </h2>

              {/* Orientation */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">Page Orientation</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['portrait', 'landscape', 'auto'] as PageOrientation[]).map(o => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOrientation(o)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        orientation === o
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Size */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">Page Size</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['a4', 'letter', 'fit'] as PageSizeOption[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPageSize(s)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold uppercase border transition-all ${
                        pageSize === s
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s === 'fit' ? 'Fit Image' : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing Progress Indicator */}
              {isProcessing && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Compiling PDF document...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleConvert}
                  isLoading={isProcessing}
                  icon={<FileText className="w-4 h-4" />}
                >
                  Convert to PDF ({items.length} {items.length === 1 ? 'Page' : 'Pages'})
                </Button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p>Your photos stay on your device. Compilation is executed 100% locally in browser memory using pdf-lib.</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Result Card */}
      {generatedPdf && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center max-w-lg mx-auto space-y-5 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Your PDF is Ready!</h2>
            <p className="text-xs text-slate-500 font-mono">
              {generatedPdf.filename} ({formatFileSize(generatedPdf.size)})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={generatedPdf.url}
              download={generatedPdf.filename}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>

            <Button
              variant="outline"
              size="md"
              onClick={handleClearAll}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Convert Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
