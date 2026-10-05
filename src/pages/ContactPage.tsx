import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { BackButton } from '../components/common/BackButton';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useToast } from '../components/common/Toast';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../utils/seo';
import { sanitizeString, isValidEmail, checkRateLimit } from '../utils/security';
import { Mail, MessageSquare, CheckCircle2, ShieldCheck, ExternalLink, Send } from 'lucide-react';
import { Link } from '../router/Router';

export const OFFICIAL_CONTACT_EMAIL = 'kmnurbusiness@gmail.com';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    updateSeoMetadata({
      title: 'Contact Us – Smartly Tools',
      description: 'Get in touch with the Smartly Tools team for inquiries, bug reports, and data privacy questions.',
      canonicalPath: '/contact',
      jsonLd: getBreadcrumbListSchema([
        { name: 'Home', item: '/' },
        { name: 'Contact', item: '/contact' }
      ])
    });
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    const cleanName = sanitizeString(formData.name, 100);
    const cleanEmail = sanitizeString(formData.email, 254);
    const cleanSubject = sanitizeString(formData.subject, 200);
    const cleanMessage = sanitizeString(formData.message, 5000);

    // Name is optional for data minimization; if provided, must be >= 2 characters
    if (cleanName && cleanName.length < 2) {
      errs.name = 'If provided, name must be at least 2 characters.';
    }

    if (!cleanEmail) {
      errs.email = 'Please provide an email address so we can reply to you.';
    } else if (!isValidEmail(cleanEmail)) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!cleanMessage || cleanMessage.length < 15) {
      errs.message = 'Please provide at least 15 characters of detail in your message.';
    }

    if (!formData.consent) {
      errs.consent = 'You must consent to data processing for inquiry handling.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(formData.subject.trim() || 'Inquiry from Smartly Tools');
    const bodyText = `Name: ${formData.name || 'Not specified'}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    return `mailto:${OFFICIAL_CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side rate limiting (5 submissions per 10 minutes)
    const rateLimit = checkRateLimit('contact_form_submits', 5, 600000);
    if (!rateLimit.allowed) {
      showToast(`Too many submissions. Please wait ${Math.ceil(rateLimit.resetIn / 60000)} minutes.`, 'error');
      return;
    }

    if (!validate()) {
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Prepare mailto link to route directly to user's specified inbox: kmnurbusiness@gmail.com
    const mailtoUrl = getMailtoUrl();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(`Message prepared for ${OFFICIAL_CONTACT_EMAIL}.`, 'success');

      // Attempt to open email client
      try {
        window.location.href = mailtoUrl;
      } catch {
        // Fallback handled by the UI button
      }
    }, 400);
  };

  return (
    <PageContainer maxWidth="4xl">
      <div className="flex items-center justify-end mb-6">
        <BackButton fallbackUrl="/" label="Back to Home" />
      </div>

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Have a question about a tool, an issue to report, or a feature suggestion? Send us a message and we'll respond promptly at{' '}
          <a
            href={`mailto:${OFFICIAL_CONTACT_EMAIL}`}
            className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {OFFICIAL_CONTACT_EMAIL}
          </a>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Direct Inquiries Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-sky-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Official Gmail</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">For all user inquiries, support & suggestions</p>
            </div>
            <a
              href={`mailto:${OFFICIAL_CONTACT_EMAIL}`}
              className="block text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 break-all hover:underline"
            >
              {OFFICIAL_CONTACT_EMAIL}
            </a>

            <a
              href={`mailto:${OFFICIAL_CONTACT_EMAIL}?subject=Smartly%20Tools%20Inquiry`}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Email Directly via Gmail</span>
            </a>
          </div>

          <div className="p-4 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Privacy & Data Minimization</span>
            </div>
            <p className="leading-relaxed">
              We collect only the email and message needed to reply. We never sell your data or use it for unsolicited marketing.
            </p>
            <Link to="/privacy-policy" className="text-slate-900 dark:text-sky-400 font-medium hover:underline inline-block mt-1">
              Read our Privacy Policy &rarr;
            </Link>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 transition-colors">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Message Ready & Routed</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your message has been directed to <strong className="text-slate-900 dark:text-slate-100 font-mono">{OFFICIAL_CONTACT_EMAIL}</strong>. If your email client did not launch automatically, please click below:
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getMailtoUrl()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open Email Client / Gmail</span>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '', consent: false });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="contact-name"
                    label="Full Name (Optional)"
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    maxLength={100}
                    onChange={e => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                    error={errors.name}
                    helperText="Used only to address you politely"
                  />

                  <Input
                    id="contact-email"
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    maxLength={254}
                    onChange={e => setFormData({ ...formData, email: e.target.value.slice(0, 254) })}
                    error={errors.email}
                    required
                    helperText="We will reply to this address"
                  />
                </div>

                <Input
                  id="contact-subject"
                  label="Subject (Optional)"
                  placeholder="e.g. Question regarding calculation accuracy"
                  value={formData.subject}
                  maxLength={200}
                  onChange={e => setFormData({ ...formData, subject: e.target.value.slice(0, 200) })}
                  error={errors.subject}
                />

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Your Message <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    maxLength={5000}
                    onChange={e => setFormData({ ...formData, message: e.target.value.slice(0, 5000) })}
                    placeholder="Please describe your question, feedback, or suggestion in detail..."
                    aria-required="true"
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400 focus:border-transparent transition-shadow resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Minimum 15 characters</span>
                    <span>{formData.message.length} / 5000</span>
                  </div>
                  {errors.message && (
                    <p id="contact-message-error" role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      id="contact-consent"
                      type="checkbox"
                      checked={formData.consent}
                      onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                      aria-required="true"
                      aria-invalid={errors.consent ? 'true' : 'false'}
                      aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
                      className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-slate-900 dark:text-sky-500 focus:ring-slate-900 dark:focus:ring-sky-400 cursor-pointer"
                    />
                    <label htmlFor="contact-consent" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">
                      I consent to Smartly Tools processing my email and message solely for the purpose of replying to this inquiry via {OFFICIAL_CONTACT_EMAIL}. I understand this data is not shared, sold, or used for marketing. <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                  </div>
                  {errors.consent && (
                    <p id="contact-consent-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send to {OFFICIAL_CONTACT_EMAIL}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
};
