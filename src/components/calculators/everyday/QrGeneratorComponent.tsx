import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { useToast } from '../../common/Toast';
import {
  QrDataType,
  QrErrorCorrectionLevel,
  validateQrUrl,
  formatWifiPayload,
  formatEmailPayload,
  formatPhonePayload,
  generateQrPngDataUrl,
  generateQrSvgString,
  generateQrWithLogo,
  WifiConfig,
  EmailConfig
} from '../../../utils/calculators/qrGenerator';
import {
  QrCode,
  Download,
  RotateCcw,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Type,
  Mail,
  Phone,
  Wifi,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Share2,
  Trash2,
  Sliders,
  Send
} from 'lucide-react';
import { safeClipboardCopy } from '../../../utils/security';

export const QrGeneratorComponent: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dataType, setDataType] = useState<QrDataType>('url');
  
  // Inputs
  const [textInput, setTextInput] = useState<string>('https://smartlytools.vercel.app');
  const [urlInput, setUrlInput] = useState<string>('https://smartlytools.vercel.app');
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({ to: '', subject: '', body: '' });
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>({ ssid: '', password: '', security: 'WPA', hidden: false });
  const [showWifiPassword, setShowWifiPassword] = useState<boolean>(false);

  // Logo / Image in Center
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string>('');
  const [logoSizeRatio, setLogoSizeRatio] = useState<number>(0.22); // 22% of QR width

  // Settings
  const [size, setSize] = useState<number>(350);
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState<number>(2);

  // Output
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, SVG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setLogoDataUrl(event.target.result);
        setLogoName(file.name);
        // Switch to Level H error correction automatically for high scannability
        setErrorCorrection('H');
        showToast('Logo added! High error correction applied to keep QR easily scannable.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoDataUrl(null);
    setLogoName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Logo removed from QR code.', 'info');
  };

  // Compute payload
  const computePayload = (): { payload: string; error?: string } => {
    switch (dataType) {
      case 'url': {
        const val = validateQrUrl(urlInput);
        if (!val.isValid) return { payload: '', error: val.error };
        return { payload: val.sanitizedUrl };
      }
      case 'text': {
        const clean = textInput.trim();
        if (!clean) return { payload: '', error: 'Please enter text to encode.' };
        return { payload: clean };
      }
      case 'email': {
        if (!emailConfig.to.trim()) return { payload: '', error: 'Please enter an email address.' };
        return { payload: formatEmailPayload(emailConfig) };
      }
      case 'phone': {
        if (!phoneInput.trim()) return { payload: '', error: 'Please enter a telephone number.' };
        return { payload: formatPhonePayload(phoneInput) };
      }
      case 'wifi': {
        if (!wifiConfig.ssid.trim()) return { payload: '', error: 'Please enter the Wi-Fi Network Name (SSID).' };
        return { payload: formatWifiPayload(wifiConfig) };
      }
      default:
        return { payload: '' };
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const generate = async () => {
      const { payload, error } = computePayload();
      if (error || !payload) {
        setValidationError(error || '');
        setQrPngUrl('');
        setQrSvgString('');
        return;
      }

      setValidationError('');
      try {
        let png = '';
        if (logoDataUrl) {
          png = await generateQrWithLogo(payload, { width: size, margin, errorCorrectionLevel: 'H' }, logoDataUrl, logoSizeRatio);
        } else {
          png = await generateQrPngDataUrl(payload, { width: size, margin, errorCorrectionLevel: errorCorrection });
        }

        const svg = await generateQrSvgString(payload, { width: size, margin, errorCorrectionLevel: logoDataUrl ? 'H' : errorCorrection });

        if (!isCancelled) {
          setQrPngUrl(png);
          setQrSvgString(svg);
        }
      } catch {
        if (!isCancelled) {
          setValidationError('Could not generate QR code. Content may exceed maximum capacity.');
        }
      }
    };

    const timer = setTimeout(generate, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [dataType, textInput, urlInput, emailConfig, phoneInput, wifiConfig, size, errorCorrection, margin, logoDataUrl, logoSizeRatio]);

  // Helper to convert data URL to File object for Web Share API
  const getQrFile = async (): Promise<File | null> => {
    if (!qrPngUrl) return null;
    try {
      const res = await fetch(qrPngUrl);
      const blob = await res.blob();
      return new File([blob], 'qrcode.png', { type: 'image/png' });
    } catch {
      return null;
    }
  };

  // WhatsApp Share Handler
  const handleShareWhatsApp = async () => {
    const { payload } = computePayload();
    const shareText = `Scan this QR Code:\n${payload || 'Generated with Smart Tools'}\nCreate your own free QR codes at: https://smartlytools.vercel.app/tools/qr-generator`;

    try {
      const file = await getQrFile();
      if (file && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'QR Code',
          text: shareText
        });
        showToast('Shared successfully!', 'success');
        return;
      }
    } catch {
      // Fallback below
    }

    // Direct WhatsApp link fallback
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening WhatsApp...', 'info');
  };

  // Instagram Share Handler
  const handleShareInstagram = async () => {
    const { payload } = computePayload();
    try {
      const file = await getQrFile();
      if (file && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'QR Code',
          text: `Scan this QR Code: ${payload}`
        });
        showToast('Shared to Instagram / Apps!', 'success');
        return;
      }
    } catch {
      // Fallback
    }

    // Copy image / link to clipboard with clear instruction for Instagram
    if (qrPngUrl) {
      try {
        const res = await fetch(qrPngUrl);
        const blob = await res.blob();
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          showToast('QR Code copied! Open Instagram and paste it in Stories or DM.', 'success');
          return;
        }
      } catch {
        // Fallback to text copy
      }
    }

    safeClipboardCopy(payload || 'https://smartlytools.vercel.app/tools/qr-generator');
    showToast('Link copied! Ready to paste into Instagram Story or Bio.', 'success');
  };

  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const a = document.createElement('a');
    a.href = qrPngUrl;
    a.download = `qrcode-${dataType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('QR Code downloaded as PNG image.', 'success');
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${dataType}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('QR Code downloaded as Scalable SVG vector.', 'success');
  };

  const handleCopyText = async () => {
    const { payload } = computePayload();
    if (!payload) return;
    const ok = await safeClipboardCopy(payload);
    if (ok) {
      setIsCopied(true);
      showToast('Encoded content copied to clipboard.', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setDataType('url');
    setUrlInput('https://smartlytools.vercel.app');
    setTextInput('https://smartlytools.vercel.app');
    setEmailConfig({ to: '', subject: '', body: '' });
    setPhoneInput('');
    setWifiConfig({ ssid: '', password: '', security: 'WPA', hidden: false });
    setSize(350);
    setErrorCorrection('M');
    setMargin(2);
    setLogoDataUrl(null);
    setLogoName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('QR settings reset to default.', 'info');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Configuration (7 cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
        
        {/* Data Type Selector Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
            Select QR Content Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { type: 'url' as QrDataType, label: 'Website URL', icon: <Globe className="w-3.5 h-3.5" /> },
              { type: 'text' as QrDataType, label: 'Plain Text', icon: <Type className="w-3.5 h-3.5" /> },
              { type: 'wifi' as QrDataType, label: 'Wi-Fi Access', icon: <Wifi className="w-3.5 h-3.5" /> },
              { type: 'email' as QrDataType, label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
              { type: 'phone' as QrDataType, label: 'Telephone', icon: <Phone className="w-3.5 h-3.5" /> }
            ].map(item => {
              const active = dataType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setDataType(item.type)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all min-h-[54px] cursor-pointer ${
                    active
                      ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Input Forms */}
        <div className="space-y-4 pt-2">
          {dataType === 'url' && (
            <Input
              label="Destination Website URL"
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              helperText="Auto-validates standard http:// and https:// web addresses."
            />
          )}

          {dataType === 'text' && (
            <div>
              <label htmlFor="qr-plain-text" className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Plain Text Message or Notes
              </label>
              <textarea
                id="qr-plain-text"
                rows={4}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Enter any text, code, notice, or message..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400"
              />
            </div>
          )}

          {dataType === 'wifi' && (
            <div className="space-y-4">
              <Input
                label="Wi-Fi Network Name (SSID)"
                type="text"
                value={wifiConfig.ssid}
                onChange={e => setWifiConfig({ ...wifiConfig, ssid: e.target.value })}
                placeholder="e.g. Home_WiFi_5G"
              />

              <div className="relative">
                <Input
                  label="Wi-Fi Password"
                  type={showWifiPassword ? 'text' : 'password'}
                  value={wifiConfig.password || ''}
                  onChange={e => setWifiConfig({ ...wifiConfig, password: e.target.value })}
                  placeholder="Enter wireless network key"
                  helperText="Never uploaded or logged. Processed 100% locally in your browser."
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wifi-sec" className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Security Type
                  </label>
                  <select
                    id="wifi-sec"
                    value={wifiConfig.security}
                    onChange={e => setWifiConfig({ ...wifiConfig, security: e.target.value as WifiConfig['security'] })}
                    className="w-full h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                    <option value="WEP">WEP (Legacy)</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="wifi-hidden"
                    type="checkbox"
                    checked={wifiConfig.hidden}
                    onChange={e => setWifiConfig({ ...wifiConfig, hidden: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <label htmlFor="wifi-hidden" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Hidden Network (SSID not broadcast)
                  </label>
                </div>
              </div>
            </div>
          )}

          {dataType === 'email' && (
            <div className="space-y-4">
              <Input
                label="Recipient Email Address"
                type="email"
                value={emailConfig.to}
                onChange={e => setEmailConfig({ ...emailConfig, to: e.target.value })}
                placeholder="contact@company.com"
              />
              <Input
                label="Subject (Optional)"
                type="text"
                value={emailConfig.subject || ''}
                onChange={e => setEmailConfig({ ...emailConfig, subject: e.target.value })}
                placeholder="Project Inquiry"
              />
              <div>
                <label htmlFor="qr-email-body" className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Default Email Body (Optional)
                </label>
                <textarea
                  id="qr-email-body"
                  rows={2}
                  value={emailConfig.body || ''}
                  onChange={e => setEmailConfig({ ...emailConfig, body: e.target.value })}
                  placeholder="Hi there, I would like to inquire about..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400"
                />
              </div>
            </div>
          )}

          {dataType === 'phone' && (
            <Input
              label="Telephone / Mobile Number"
              type="tel"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              placeholder="+91 98765 43210"
              helperText="Include country code for universal smartphone dialing."
            />
          )}
        </div>

        {/* Center Logo / Image Upload Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Add Center Logo / Photo in QR</span>
            </span>
            {logoDataUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium inline-flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Remove Logo
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleLogoUpload}
            className="hidden"
            id="qr-logo-upload"
          />

          {!logoDataUrl ? (
            <label
              htmlFor="qr-logo-upload"
              className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-colors text-xs text-slate-600 dark:text-slate-300 font-medium"
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Upload Brand Logo or Picture (PNG, JPG, SVG)</span>
            </label>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={logoDataUrl} alt="Logo preview" className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-600 bg-white p-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">{logoName || 'Center Logo'}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Embedded in center of QR</p>
                </div>
              </div>

              {/* Logo Size Adjuster */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">Logo Size:</span>
                <input
                  type="range"
                  min={0.16}
                  max={0.26}
                  step={0.02}
                  value={logoSizeRatio}
                  onChange={e => setLogoSizeRatio(parseFloat(e.target.value))}
                  className="w-24 accent-slate-900 dark:accent-sky-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Customization Options Accordion/Row */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="qr-size-sel" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Resolution (Export)
            </label>
            <select
              id="qr-size-sel"
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400"
            >
              <option value={200}>200 × 200 px (Compact)</option>
              <option value={350}>350 × 350 px (Standard)</option>
              <option value={500}>500 × 500 px (Print Quality)</option>
              <option value={800}>800 × 800 px (Ultra HD)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-err-sel" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Error Correction
            </label>
            <select
              id="qr-err-sel"
              value={errorCorrection}
              disabled={Boolean(logoDataUrl)}
              onChange={e => setErrorCorrection(e.target.value as QrErrorCorrectionLevel)}
              className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400 disabled:opacity-60"
            >
              <option value="L">Level L (7% Recovery)</option>
              <option value="M">Level M (15% Recovery - Recommended)</option>
              <option value="Q">Level Q (25% Recovery)</option>
              <option value="H">Level H (30% Recovery - Best with Logo)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-margin-sel" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quiet Zone (Border)
            </label>
            <select
              id="qr-margin-sel"
              value={margin}
              onChange={e => setMargin(Number(e.target.value))}
              className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400"
            >
              <option value={1}>1 module (Tight)</option>
              <option value={2}>2 modules (Standard)</option>
              <option value={4}>4 modules (Wide Spec)</option>
            </select>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-2 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset All
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyText}
            icon={isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {isCopied ? 'Copied Content' : 'Copy Content'}
          </Button>
        </div>

      </div>

      {/* Preview & Sharing Column (5 cols) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-center transition-colors">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-left border-b border-slate-100 dark:border-slate-800 pb-3">
          Generated QR Code
        </h2>

        {/* QR Display Area */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[280px]">
          {validationError ? (
            <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900 text-center max-w-xs">
              <p className="font-semibold">{validationError}</p>
            </div>
          ) : qrPngUrl ? (
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <img
                src={qrPngUrl}
                alt="Generated QR code"
                width={240}
                height={240}
                className="max-w-[240px] h-auto object-contain select-none"
              />
            </div>
          ) : (
            <div className="text-slate-400 flex flex-col items-center gap-2">
              <QrCode className="w-12 h-12 opacity-30" />
              <p className="text-xs">Enter data above to preview QR code</p>
            </div>
          )}
        </div>

        {/* Share directly on WhatsApp & Instagram */}
        {qrPngUrl && (
          <div className="space-y-3 pt-1">
            <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-left">
              Direct Share Options
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareInstagram}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-90 text-white rounded-xl font-bold text-xs shadow-xs transition-opacity cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </button>
            </div>
          </div>
        )}

        {/* Download Buttons */}
        {qrPngUrl && (
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleDownloadPng}
              icon={<Download className="w-4 h-4" />}
            >
              Download PNG Image
            </Button>

            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleDownloadSvg}
              icon={<Download className="w-4 h-4" />}
            >
              Download Vector SVG
            </Button>
          </div>
        )}

        {/* Privacy Assurance Card */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">100% Client-Side:</strong> QR codes and uploaded logos are rendered locally on your device canvas. Nothing is uploaded to remote servers.
          </p>
        </div>
      </div>
    </div>
  );
};
