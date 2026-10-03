import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/security/fileSecurity';
import { Button } from './Button';

export interface FileUploadZoneProps {
  accept: string; // e.g. "image/jpeg,image/png,image/webp" or "application/pdf"
  multiple?: boolean;
  maxSizeMB?: number;
  label: string;
  helperText?: string;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  accept,
  multiple = false,
  maxSizeMB = 50,
  label,
  helperText,
  onFilesSelected,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = Array.from(e.dataTransfer.files);
      onFilesSelected(multiple ? selected : [selected[0]]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesSelected(multiple ? selected : [selected[0]]);
    }
    // Reset input so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickZone = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickZone}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClickZone();
          }
        }}
        aria-label={`${label}. Click or drop files here`}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
          isDragOver
            ? 'border-slate-900 bg-slate-100/80 scale-[1.005]'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700">
            <Upload className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">
              {label}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Drag & drop here, or <span className="text-slate-900 font-semibold underline">browse from your device</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
            <span>Supported: {accept.replace(/image\//g, '').replace(/application\//g, '').toUpperCase()}</span>
            <span>·</span>
            <span>Max Size: {maxSizeMB} MB</span>
          </div>

          {helperText && (
            <p className="text-[11px] text-slate-500 pt-1">
              {helperText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
