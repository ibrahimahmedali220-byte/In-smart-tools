import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Modal } from './Modal';
import { Button } from './Button';
import { useToast } from './Toast';
import { safeClipboardCopy } from '../../utils/security';
import {
  Copy,
  Check,
  QrCode,
  Code,
  Share2,
  Download,
  MessageCircle,
  Send,
  Linkedin,
  Mail,
  ExternalLink
} from 'lucide-react';

export interface ToolShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  toolSlug: string;
  toolDescription: string;
}

export const ToolShareModal: React.FC<ToolShareModalProps> = ({
  isOpen,
  onClose,
  toolName,
  toolSlug,
  toolDescription
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'embed'>('link');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const { showToast } = useToast();

  const toolUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/tools/${toolSlug}`
    : `https://www.smartlytools.cyou/tools/${toolSlug}`;

  // Generate QR code when modal opens or tool changes
  useEffect(() => {
    if (isOpen && toolUrl) {
      QRCode.toDataURL(toolUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
        .then(url => setQrDataUrl(url))
        .catch(() => setQrDataUrl(''));
    }
  }, [isOpen, toolUrl]);

  const handleCopyLink = async () => {
    const success = await safeClipboardCopy(toolUrl);
    if (success) {
      setCopiedLink(true);
      showToast('Tool link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      showToast('Unable to copy link', 'error');
    }
  };

  const embedCode = `<iframe src="${toolUrl}" width="100%" height="700" frameborder="0" style="border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);max-width:1000px;" title="${toolName} – Free Tool by Smartly Tools"></iframe>
<p style="font-size:12px;color:#64748b;margin-top:6px;text-align:center;">Powered by <a href="${toolUrl}" target="_blank" rel="noopener noreferrer" style="color:#0284c7;text-decoration:none;font-weight:600;">Smartly Tools</a></p>`;

  const handleCopyEmbed = async () => {
    const success = await safeClipboardCopy(embedCode);
    if (success) {
      setCopiedEmbed(true);
      showToast('Embed widget code copied to clipboard!', 'success');
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      showToast('Unable to copy embed code', 'error');
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${toolSlug}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR Code downloaded successfully', 'success');
  };

  // Social share intent URLs
  const shareTitle = encodeURIComponent(`${toolName} – Free Online Tool on Smartly Tools`);
  const encodedUrl = encodeURIComponent(toolUrl);
  const shareText = encodeURIComponent(`${toolDescription}\n\nUse it here: `);

  const socialChannels = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodedUrl}`,
      bgColor: 'hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600',
      badgeColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      name: 'Telegram',
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${shareTitle}`,
      bgColor: 'hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600',
      badgeColor: 'text-sky-500 dark:text-sky-400'
    },
    {
      name: 'X (Twitter)',
      icon: ExternalLink,
      href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}&hashtags=SmartlyTools,Productivity`,
      bgColor: 'hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700',
      badgeColor: 'text-slate-800 dark:text-slate-300'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bgColor: 'hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600',
      badgeColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${shareTitle}&body=${shareText}${encodedUrl}`,
      bgColor: 'hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600',
      badgeColor: 'text-rose-500 dark:text-rose-400'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Share & Embed: ${toolName}`}
      description="Share this free calculator with friends, open on your phone via QR code, or embed on your website."
      maxWidth="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'link'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Social & Link</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Mobile QR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'embed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Embed Widget</span>
          </button>
        </div>

        {/* TAB 1: SOCIAL & DIRECT LINK */}
        {activeTab === 'link' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Direct Tool Link
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <input
                  type="text"
                  readOnly
                  value={toolUrl}
                  className="bg-transparent flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono focus:outline-none px-2 select-all"
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCopyLink}
                  icon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  className="shrink-0 text-xs"
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                1-Click Instant Share
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                {socialChannels.map(ch => {
                  const Icon = ch.icon;
                  return (
                    <a
                      key={ch.name}
                      href={ch.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 transition-all ${ch.bgColor} group`}
                    >
                      <Icon className={`w-5 h-5 ${ch.badgeColor} group-hover:text-white transition-colors`} />
                      <span className="text-xs font-medium">{ch.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOBILE QR CODE */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${toolName}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-xl animate-pulse">
                  <QrCode className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Scan with your Phone Camera
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Instantly opens {toolName} on iOS or Android with zero app downloads or accounts.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownloadQr}
              className="text-xs"
            >
              Download QR Image (.PNG)
            </Button>
          </div>
        )}

        {/* TAB 3: EMBED WIDGET */}
        {activeTab === 'embed' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Embed HTML Snippet
                </label>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Free & Responsive
                </span>
              </div>
              <textarea
                readOnly
                rows={4}
                value={embedCode}
                className="w-full text-xs font-mono p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 focus:outline-none select-all resize-none"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste this into WordPress, HTML, Webflow, or Notion to render this calculator.
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={handleCopyEmbed}
                icon={copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                className="shrink-0 text-xs"
              >
                {copiedEmbed ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
