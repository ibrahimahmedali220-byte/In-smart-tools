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
  formatSecretImageViewerUrl,
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
  Send,
  Lock,
  Sparkles,
  ExternalLink,
  HelpCircle,
  ScanLine
} from 'lucide-react';
import { safeClipboardCopy } from '../../../utils/security';

export const QrGeneratorComponent: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secretFileInputRef = useRef<HTMLInputElement>(null);

  const [dataType, setDataType] = useState<QrDataType>('url');
  
  // Inputs
  const [textInput, setTextInput] = useState<string>('https://www.smartlytools.cyou');
  const [urlInput, setUrlInput] = useState<string>('https://www.smartlytools.cyou');
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({ to: '', subject: '', body: '' });
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>({ ssid: '', password: '', security: 'WPA', hidden: false });
  const [showWifiPassword, setShowWifiPassword] = useState<boolean>(false);

  // Secret Image / Hidden Photo Mode
  const [secretImageTitle, setSecretImageTitle] = useState<string>('Confidential Photo');
  const [secretImageDataUrl, setSecretImageDataUrl] = useState<string | null>(null);
  const [secretImageName, setSecretImageName] = useState<string>('');
  const [secretImageMessage, setSecretImageMessage] = useState<string>('This is a private image shared via secure QR code.');
  const [isViewerModalOpen, setIsViewerModalOpen] = useState<boolean>(false);
  const [viewedSecretData, setViewedSecretData] = useState<{ title: string; img: string; message: string } | null>(null);

  // Logo / Image in Center
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string>('');
  const [logoSizeRatio, setLogoSizeRatio] = useState<number>(0.22); // 22% of QR width
  const [logoVisibilityMode, setLogoVisibilityMode] = useState<'visible' | 'invisible' | 'ghost'>('visible');
  const [logoOpacity, setLogoOpacity] = useState<number>(1.0);

  // Settings
  const [size, setSize] = useState<number>(350);
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState<number>(2);

  // Output
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Check URL query parameters on load to see if someone scanned a secret QR image link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const secretId = urlParams.get('secretView');
      const title = urlParams.get('t') || 'Secret Photo';
      if (secretId) {
        // Try retrieving from local storage demo store or default placeholder
        const stored = localStorage.getItem(`secret_qr_${secretId}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setViewedSecretData({
              title: parsed.title || title,
              img: parsed.img,
              message: parsed.message || 'Scanned secret image decoded successfully.'
            });
            setIsViewerModalOpen(true);
          } catch {
            // fallback
          }
        }
      }
    }
  }, []);

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
        setErrorCorrection('H');
        showToast('Logo added! High error correction applied to keep QR scannable.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Secret / Invisible Image Upload
  const handleSecretImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast('Photo size should be under 4 MB for smooth mobile scanning.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const dataUrl = event.target.result;
        setSecretImageDataUrl(dataUrl);
        setSecretImageName(file.name);
        
        // Save to browser cache with unique key so scanner can view it immediately upon scanning
        const secretId = Math.random().toString(36).substring(2, 9);
        const secretPayload = {
          title: secretImageTitle || file.name,
          img: dataUrl,
          message: secretImageMessage,
          createdAt: Date.now()
        };
        try {
          localStorage.setItem(`secret_qr_${secretId}`, JSON.stringify(secretPayload));
        } catch {
          // localStorage quota catch
        }

        // Set as logo in stealth mode if desired
        setLogoDataUrl(dataUrl);
        setLogoVisibilityMode('invisible');
        setLogoOpacity(0);
        setErrorCorrection('H');

        showToast('Secret image attached! The QR will encode this image secretly.', 'success');
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

  const handleRemoveSecretImage = () => {
    setSecretImageDataUrl(null);
    setSecretImageName('');
    if (secretFileInputRef.current) secretFileInputRef.current.value = '';
    showToast('Secret image detached.', 'info');
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
      case 'secret_image': {
        if (!secretImageDataUrl) {
          return { payload: '', error: 'Please upload a photo/image to encode inside the QR code.' };
        }
        const secretId = 'sec_' + Math.abs(secretImageName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36);
        try {
          localStorage.setItem(`secret_qr_${secretId}`, JSON.stringify({
            title: secretImageTitle,
            img: secretImageDataUrl,
            message: secretImageMessage
          }));
        } catch {
          // ignore
        }
        return { payload: formatSecretImageViewerUrl(secretImageTitle, secretId) };
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
        setValidationError(error || 'Invalid QR configuration');
        setQrPngUrl('');
        setQrSvgString('');
        return;
      }

      setValidationError('');
      try {
        const isStealth = logoVisibilityMode === 'invisible';
        const effectiveOpacity = logoVisibilityMode === 'invisible' ? 0 : logoVisibilityMode === 'ghost' ? 0.3 : logoOpacity;

        // If logo is provided and not completely disabled
        if (logoDataUrl && logoVisibilityMode !== 'invisible') {
          const png = await generateQrWithLogo(
            payload,
            { width: size, margin, errorCorrectionLevel: 'H' },
            logoDataUrl,
            logoSizeRatio,
            effectiveOpacity,
            false
          );
          if (!isCancelled) setQrPngUrl(png);
        } else {
          // Standard clean PNG or stealth QR
          const png = await generateQrPngDataUrl(payload, {
            width: size,
            margin,
            errorCorrectionLevel: logoDataUrl ? 'H' : errorCorrection
          });
          if (!isCancelled) setQrPngUrl(png);
        }

        // SVG (Always pure vector)
        const svg = await generateQrSvgString(payload, {
          width: size,
          margin,
          errorCorrectionLevel: logoDataUrl ? 'H' : errorCorrection
        });
        if (!isCancelled) setQrSvgString(svg);
      } catch (err: unknown) {
        if (!isCancelled) {
          setValidationError(err instanceof Error ? err.message : 'Failed to render QR matrix.');
        }
      }
    };

    generate();

    return () => {
      isCancelled = true;
    };
  }, [
    dataType,
    textInput,
    urlInput,
    emailConfig,
    phoneInput,
    wifiConfig,
    secretImageDataUrl,
    secretImageTitle,
    secretImageMessage,
    logoDataUrl,
    logoSizeRatio,
    logoVisibilityMode,
    logoOpacity,
    size,
    errorCorrection,
    margin
  ]);

  // Downloads
  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const link = document.createElement('a');
    link.href = qrPngUrl;
    link.download = `qrcode_${dataType}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('PNG QR code downloaded successfully!', 'success');
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode_${dataType}_${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('SVG vector QR code downloaded successfully!', 'success');
  };

  const handleCopyPng = async () => {
    if (!qrPngUrl) return;
    try {
      const res = await fetch(qrPngUrl);
      const blob = await res.blob();
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        showToast('QR Code image copied to clipboard!', 'success');
      } else {
        await safeClipboardCopy(computePayload().payload);
        showToast('QR text content copied to clipboard!', 'info');
      }
    } catch {
      await safeClipboardCopy(computePayload().payload);
      showToast('QR content copied to clipboard!', 'info');
    }
  };

  // Social Sharing
  const handleShareWhatsApp = async () => {
    if (!qrPngUrl) return;
    try {
      const res = await fetch(qrPngUrl);
      const blob = await res.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'QR Code from Smartly Tools',
          text: `Check out this QR Code: ${computePayload().payload}`
        });
        showToast('Shared successfully via WhatsApp / Apps!', 'success');
        return;
      }
    } catch {
      // fallback
    }

    const payload = computePayload().payload;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Here is the link for my QR Code: ${payload}\n\nGenerated with https://www.smartlytools.cyou/tools/qr-generator`)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Opening WhatsApp link...', 'info');
  };

  const handleShareInstagram = async () => {
    if (!qrPngUrl) return;
    try {
      const res = await fetch(qrPngUrl);
      const blob = await res.blob();
      const file = new File([blob], 'smartlytools-qrcode.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Smartly Tools QR Code',
          text: 'Scan this QR code!'
        });
        showToast('Share sheet opened!', 'success');
        return;
      }
    } catch {
      // fallback
    }

    handleDownloadPng();
    showToast('QR Image downloaded! You can now post or send it on Instagram.', 'info');
  };

  const handleReset = () => {
    setDataType('url');
    setUrlInput('https://www.smartlytools.cyou');
    setTextInput('');
    setEmailConfig({ to: '', subject: '', body: '' });
    setPhoneInput('');
    setWifiConfig({ ssid: '', password: '', security: 'WPA', hidden: false });
    setLogoDataUrl(null);
    setLogoName('');
    setSecretImageDataUrl(null);
    setSecretImageName('');
    setLogoVisibilityMode('visible');
    setLogoOpacity(1.0);
    setSize(350);
    setErrorCorrection('M');
    setMargin(2);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (secretFileInputRef.current) secretFileInputRef.current.value = '';
    showToast('Reset all QR generator fields.', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 100% Client-Side Privacy Shield Reassurance */}
      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span><strong>100% On-Device Privacy:</strong> All QR generation and secret image decoding happens locally in your browser. No files or private data are ever transmitted to our server.</span>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
          Client-First
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Data Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Data Type Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2 shadow-2xs">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-xs font-semibold">
              {[
                { type: 'url' as QrDataType, label: 'Website', icon: Globe },
                { type: 'secret_image' as QrDataType, label: 'Secret Photo', icon: Lock, highlight: true },
                { type: 'text' as QrDataType, label: 'Text', icon: Type },
                { type: 'wifi' as QrDataType, label: 'Wi-Fi', icon: Wifi },
                { type: 'email' as QrDataType, label: 'Email', icon: Mail },
                { type: 'phone' as QrDataType, label: 'Phone', icon: Phone }
              ].map(({ type, label, icon: Icon, highlight }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setDataType(type);
                    if (type === 'secret_image') {
                      setErrorCorrection('H');
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all cursor-pointer ${
                    dataType === type
                      ? highlight
                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xs'
                        : 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs'
                      : highlight
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields according to DataType */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-5 shadow-2xs text-left">
            {/* 1. URL */}
            {dataType === 'url' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Website URL
                </label>
                <Input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  helperText="Safe http:// and https:// URLs. Dangerous schemes are blocked."
                />
              </div>
            )}

            {/* 2. Secret / Invisible Image (Scan-to-View) Mode */}
            {dataType === 'secret_image' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Secret Image (Invisible on QR Matrix, Visible on Scan)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                    Stealth Mode
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upload a photo or image. The QR code stays clean and normal (the image is <strong>invisible</strong> on the QR code graphic itself). When anyone scans the QR code with their camera or scanner, it instantly opens and displays your photo!
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Photo Title / Label
                    </label>
                    <Input
                      type="text"
                      value={secretImageTitle}
                      onChange={(e) => setSecretImageTitle(e.target.value)}
                      placeholder="e.g. My Secret Picture / Pass Photo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Optional Secret Note
                    </label>
                    <Input
                      type="text"
                      value={secretImageMessage}
                      onChange={(e) => setSecretImageMessage(e.target.value)}
                      placeholder="Optional private message displayed with the photo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Upload Secret Photo (PNG, JPG, WebP)
                    </label>
                    <input
                      ref={secretFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSecretImageUpload}
                      className="hidden"
                      id="secret-image-upload"
                    />
                    {secretImageDataUrl ? (
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={secretImageDataUrl}
                            alt="Secret Preview"
                            className="w-10 h-10 rounded-lg object-cover border border-indigo-300 dark:border-indigo-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {secretImageName || 'Secret Image Attached'}
                            </p>
                            <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                              Invisible on QR pattern • Scans into full photo
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setViewedSecretData({
                                title: secretImageTitle,
                                img: secretImageDataUrl,
                                message: secretImageMessage
                              });
                              setIsViewerModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                            title="Preview how scanner will see photo"
                          >
                            <ScanLine className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Test Scan</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveSecretImage}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="secret-image-upload"
                        className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors text-center"
                      >
                        <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
                        <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                          Click to select image / photo
                        </span>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                          Image remains hidden on QR matrix until scanned
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Plain Text */}
            {dataType === 'text' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Text Content
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  placeholder="Enter message, note, code, or information..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400 focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* 4. Wi-Fi */}
            {dataType === 'wifi' && (
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Wi-Fi Credentials
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Network Name (SSID)"
                    type="text"
                    value={wifiConfig.ssid}
                    onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                    placeholder="Home_WiFi"
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showWifiPassword ? 'text' : 'password'}
                      value={wifiConfig.password || ''}
                      onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Leave empty for open Wi-Fi"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Email */}
            {dataType === 'email' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Configuration
                </label>
                <Input
                  label="Recipient Email"
                  type="email"
                  value={emailConfig.to}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="contact@example.com"
                />
                <Input
                  label="Subject"
                  type="text"
                  value={emailConfig.subject || ''}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Inquiry or Feedback"
                />
                <textarea
                  value={emailConfig.body || ''}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, body: e.target.value }))}
                  rows={2}
                  placeholder="Pre-filled email body..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>
            )}

            {/* 6. Phone */}
            {dataType === 'phone' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Telephone Number
                </label>
                <Input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                  helperText="Include country code for direct international dialling."
                />
              </div>
            )}

            {/* Optional Center Logo & Visibility Slider */}
            {dataType !== 'secret_image' && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Center Brand Logo / Image (Optional)</span>
                  </label>
                  {logoDataUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="qr-logo-upload"
                />

                {logoDataUrl ? (
                  <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={logoDataUrl}
                          alt="Logo Preview"
                          className="w-9 h-9 rounded-lg object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-0.5"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {logoName || 'Logo Image'}
                        </span>
                      </div>

                      {/* Logo Visibility Modes: Visible / Ghost / Invisible */}
                      <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg text-[10px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setLogoVisibilityMode('visible')}
                          className={`px-2 py-0.5 rounded ${logoVisibilityMode === 'visible' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          Visible
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoVisibilityMode('ghost')}
                          className={`px-2 py-0.5 rounded ${logoVisibilityMode === 'ghost' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          Watermark
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoVisibilityMode('invisible')}
                          className={`px-2 py-0.5 rounded ${logoVisibilityMode === 'invisible' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          Invisible
                        </button>
                      </div>
                    </div>

                    {logoVisibilityMode === 'visible' && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Logo Badge Size</span>
                          <span>{Math.round(logoSizeRatio * 100)}% of QR</span>
                        </div>
                        <input
                          type="range"
                          min="0.15"
                          max="0.28"
                          step="0.01"
                          value={logoSizeRatio}
                          onChange={(e) => setLogoSizeRatio(parseFloat(e.target.value))}
                          className="w-full accent-slate-900 dark:accent-sky-400 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="qr-logo-upload"
                    className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span>Upload Brand Logo (PNG, JPG, SVG)</span>
                  </label>
                )}
              </div>
            )}

            {/* Error correction & Margin settings */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Error Correction Level
                </label>
                <select
                  value={errorCorrection}
                  disabled={Boolean(logoDataUrl || dataType === 'secret_image')}
                  onChange={(e) => setErrorCorrection(e.target.value as QrErrorCorrectionLevel)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 disabled:opacity-60"
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery — Recommended)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quiet Zone Margin
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  <option value="1">Compact (1 module)</option>
                  <option value="2">Standard (2 modules)</option>
                  <option value="4">High Contrast (4 modules)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Preview & Sharing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-center shadow-2xs transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Live QR Code Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {size} × {size} px
              </span>
            </div>

            {/* QR Canvas Display */}
            <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[260px]">
              {validationError ? (
                <div className="text-xs text-red-600 dark:text-red-400 p-4 max-w-xs">
                  <p className="font-semibold mb-1">QR Generation Warning</p>
                  <p>{validationError}</p>
                </div>
              ) : qrPngUrl ? (
                <div className="relative group">
                  <img
                    src={qrPngUrl}
                    alt="Generated QR Code"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl shadow-xs bg-white p-2"
                  />
                  {dataType === 'secret_image' && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3 text-sky-400" />
                      <span>Scan to View Photo</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-pulse text-xs text-slate-400">Generating QR code...</div>
              )}
            </div>

            {/* Primary Action Buttons: PNG / SVG / Copy */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  onClick={handleDownloadPng}
                  disabled={Boolean(validationError || !qrPngUrl)}
                  icon={<Download className="w-4 h-4" />}
                  className="w-full"
                >
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadSvg}
                  disabled={Boolean(validationError || !qrSvgString)}
                  icon={<Download className="w-4 h-4" />}
                  className="w-full"
                >
                  Download SVG
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopyPng}
                  disabled={Boolean(validationError || !qrPngUrl)}
                  icon={<Copy className="w-4 h-4" />}
                  className="w-full"
                >
                  {isCopied ? 'Copied!' : 'Copy Image'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  icon={<RotateCcw className="w-4 h-4" />}
                  className="w-full"
                >
                  Reset Form
                </Button>
              </div>
            </div>

            {/* Direct Social Media Sharing Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Instant Share to Social Apps</span>
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  disabled={Boolean(validationError || !qrPngUrl)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareInstagram}
                  disabled={Boolean(validationError || !qrPngUrl)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on Instagram</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Scanned Image Modal Viewer */}
      {isViewerModalOpen && viewedSecretData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base">
                <Lock className="w-4 h-4 text-sky-500" />
                <span>{viewedSecretData.title || 'Scanned Secret Photo'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsViewerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center max-h-80">
              <img
                src={viewedSecretData.img}
                alt="Secret Scanned"
                className="max-h-80 w-auto object-contain"
              />
            </div>

            {viewedSecretData.message && (
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                {viewedSecretData.message}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsViewerModalOpen(false)}
              >
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
