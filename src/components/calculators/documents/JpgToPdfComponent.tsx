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
import {
  FileText,
  Download,
  RotateCcw,
  Trash2,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Send
} from 'lucide-react';

export const JpgToPdfComponent: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<ImageInputItem[]>([]);
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedPdf, setGeneratedPdf] = useState<{ url: string; filename: string; size: number; blob: Blob } | null>(null);

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
        size: result.blob.size,
        blob: result.blob
      });
      showToast('PDF compiled successfully!', 'success');
    } catch {
      showToast('Failed to compile PDF document. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  // WhatsApp Share Handler for PDF
  const handleShareWhatsApp = async () => {
    if (!generatedPdf) return;

    try {
      const file = new File([generatedPdf.blob], generatedPdf.filename, { type: 'application/pdf' });
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: generatedPdf.filename,
          text: `Here is the PDF document: ${generatedPdf.filename} (compiled with Smart Tools)`
        });
        showToast('PDF shared to WhatsApp / Apps!', 'success');
        return;
      }
    } catch {
      // Fallback
    }

    // Trigger download & open WhatsApp web
    const a = document.createElement('a');
    a.href = generatedPdf.url;
    a.download = generatedPdf.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`I have created a PDF: ${generatedPdf.filename} using Smart Tools (https://smartlytools.vercel.app/tools/jpg-to-pdf)`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast('PDF downloaded! Opening WhatsApp to send...', 'info');
  };

  // Instagram Share Handler for PDF
  const handleShareInstagram = async () => {
    if (!generatedPdf) return;

    try {
      const file = new File([generatedPdf.blob], generatedPdf.filename, { type: 'application/pdf' });
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: generatedPdf.filename,
          text: `PDF Document: ${generatedPdf.filename}`
        });
        showToast('Shared to Instagram / Apps!', 'success');
        return;
      }
    } catch {
      // Fallback
    }

    // Download file
    const a = document.createElement('a');
    a.href = generatedPdf.url;
    a.download = generatedPdf.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('PDF downloaded to your device for Instagram sharing.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <FileUploadZone
        accept="image/jpeg,image/png,image/webp"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        label="Upload Images (JPG, PNG, WebP)"
        helperText="Select or drag and drop photos, scanned marksheets, identity cards, or certificates."
      />

      {/* Selected Items & Order */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Pages Order ({items.length} {items.length === 1 ? 'Image' : 'Images'})
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[160px] sm:max-w-xs">{item.name}</p>
                      <p className="text-slate-400 text-[11px]">{formatFileSize(item.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration & Action (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-6 transition-colors">
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
              Document Options
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Page Orientation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'portrait' as PageOrientation, label: 'Portrait (Standard)' },
                    { id: 'landscape' as PageOrientation, label: 'Landscape' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOrientation(opt.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        orientation === opt.id
                          ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Page Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'a4' as PageSizeOption, label: 'A4 Page' },
                    { id: 'letter' as PageSizeOption, label: 'Letter' },
                    { id: 'fit' as PageSizeOption, label: 'Fit Image' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPageSize(opt.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        pageSize === opt.id
                          ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing Progress Indicator */}
              {isProcessing && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span>Compiling PDF document...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 dark:bg-sky-500 h-full transition-all duration-200"
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

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p>Your photos stay on your device. Compilation is executed 100% locally in browser memory using pdf-lib.</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Result Card */}
      {generatedPdf && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8 text-center max-w-lg mx-auto space-y-6 animate-in fade-in duration-200 transition-colors">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your PDF is Ready!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {generatedPdf.filename} ({formatFileSize(generatedPdf.size)})
            </p>
          </div>

          {/* Direct WhatsApp & Instagram Share Buttons */}
          <div className="space-y-2.5 pt-1">
            <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">
              Direct Share Options
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareInstagram}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-90 text-white rounded-xl font-bold text-xs shadow-xs transition-opacity cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <a
              href={generatedPdf.url}
              download={generatedPdf.filename}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-600 text-white dark:text-slate-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
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
