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
  EyeOff
} from 'lucide-react';
import { safeClipboardCopy } from '../../../utils/security';

export const QrGeneratorComponent: React.FC = () => {
  const { showToast } = useToast();

  const [dataType, setDataType] = useState<QrDataType>('url');
  
  // Inputs
  const [textInput, setTextInput] = useState<string>('https://indiasmarttools.in');
  const [urlInput, setUrlInput] = useState<string>('https://indiasmarttools.in');
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({ to: '', subject: '', body: '' });
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>({ ssid: '', password: '', security: 'WPA', hidden: false });
  const [showWifiPassword, setShowWifiPassword] = useState<boolean>(false);

  // Settings
  const [size, setSize] = useState<number>(300);
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState<number>(2);

  // Output
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

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
        const [png, svg] = await Promise.all([
          generateQrPngDataUrl(payload, { width: size, margin, errorCorrectionLevel: errorCorrection }),
          generateQrSvgString(payload, { width: size, margin, errorCorrectionLevel: errorCorrection })
        ]);

        if (!isCancelled) {
          setQrPngUrl(png);
          setQrSvgString(svg);
        }
      } catch {
        if (!isCancelled) {
          setValidationError('Could not generate QR code. Content may exceed maximum QR capacity.');
        }
      }
    };

    const timer = setTimeout(generate, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [dataType, textInput, urlInput, emailConfig, phoneInput, wifiConfig, size, errorCorrection, margin]);

  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const a = document.createElement('a');
    a.href = qrPngUrl;
    a.download = `qrcode_${dataType}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded QR Code as PNG.', 'success');
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${dataType}_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded QR Code as Scalable SVG.', 'success');
  };

  const handleCopyText = async () => {
    const { payload } = computePayload();
    if (!payload) return;
    const ok = await safeClipboardCopy(payload);
    if (ok) {
      setIsCopied(true);
      showToast('QR content copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setDataType('url');
    setUrlInput('https://indiasmarttools.in');
    setTextInput('');
    setEmailConfig({ to: '', subject: '', body: '' });
    setPhoneInput('');
    setWifiConfig({ ssid: '', password: '', security: 'WPA', hidden: false });
    setSize(300);
    setErrorCorrection('M');
    setMargin(2);
    showToast('QR generator reset to default.', 'info');
  };

  const DATA_TYPES: { id: QrDataType; label: string; icon: React.ReactNode }[] = [
    { id: 'url', label: 'Website URL', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'text', label: 'Plain Text', icon: <Type className="w-3.5 h-3.5" /> },
    { id: 'wifi', label: 'Wi-Fi Network', icon: <Wifi className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'phone', label: 'Phone', icon: <Phone className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls Column (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
        
        {/* Type Selector Tabs */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-2">QR Code Data Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DATA_TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDataType(t.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  dataType === t.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Inputs per Type */}
        <div className="space-y-4 pt-2">
          {dataType === 'url' && (
            <div>
              <Input
                label="Destination URL"
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                helperText="Enter a secure web link (e.g. https://yourbusiness.com)."
              />
            </div>
          )}

          {dataType === 'text' && (
            <div>
              <label htmlFor="qr-plain-text" className="block text-xs font-semibold text-slate-900 mb-1">
                Plain Text Message
              </label>
              <textarea
                id="qr-plain-text"
                rows={4}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Enter any text, announcement, address, or note..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
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
                placeholder="Home_WiFi_5G"
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
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wifi-sec" className="block text-xs font-semibold text-slate-900 mb-1">
                    Security Type
                  </label>
                  <select
                    id="wifi-sec"
                    value={wifiConfig.security}
                    onChange={e => setWifiConfig({ ...wifiConfig, security: e.target.value as WifiConfig['security'] })}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                  <label htmlFor="wifi-hidden" className="text-xs font-semibold text-slate-700 cursor-pointer">
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
                <label htmlFor="qr-email-body" className="block text-xs font-semibold text-slate-900 mb-1">
                  Default Email Body (Optional)
                </label>
                <textarea
                  id="qr-email-body"
                  rows={2}
                  value={emailConfig.body || ''}
                  onChange={e => setEmailConfig({ ...emailConfig, body: e.target.value })}
                  placeholder="Hi there, I would like to inquire about..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
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

        {/* Customization Options Accordion/Row */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="qr-size-sel" className="block text-xs font-semibold text-slate-700 mb-1">
              Resolution (Export)
            </label>
            <select
              id="qr-size-sel"
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value={200}>200 × 200 px (Compact)</option>
              <option value={300}>300 × 300 px (Standard)</option>
              <option value={500}>500 × 500 px (Print Quality)</option>
              <option value={800}>800 × 800 px (Ultra HD)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-err-sel" className="block text-xs font-semibold text-slate-700 mb-1">
              Error Correction
            </label>
            <select
              id="qr-err-sel"
              value={errorCorrection}
              onChange={e => setErrorCorrection(e.target.value as QrErrorCorrectionLevel)}
              className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="L">Level L (7% Recovery)</option>
              <option value="M">Level M (15% Recovery - Recommended)</option>
              <option value="Q">Level Q (25% Recovery)</option>
              <option value="H">Level H (30% Recovery - Best for Print)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-margin-sel" className="block text-xs font-semibold text-slate-700 mb-1">
              Quiet Zone (Border)
            </label>
            <select
              id="qr-margin-sel"
              value={margin}
              onChange={e => setMargin(Number(e.target.value))}
              className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
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

      {/* Preview & Download Column (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 text-center">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-left border-b border-slate-100 pb-3">
          Generated QR Code
        </h2>

        {/* QR Display Area */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 min-h-[280px]">
          {validationError ? (
            <div className="text-xs text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 text-center max-w-xs">
              <p className="font-semibold">{validationError}</p>
            </div>
          ) : qrPngUrl ? (
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
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

        {/* Download Buttons */}
        {qrPngUrl && (
          <div className="space-y-2.5">
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
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 font-semibold">100% Client-Side:</strong> QR matrices are calculated strictly in your browser. Passwords, links, and text are never sent to any remote server or analytics engine.
          </p>
        </div>
      </div>
    </div>
  );
};
