import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../components/common/Toast';
import { updateSeoMetadata, getBreadcrumbListSchema } from '../../utils/seo';
import { sanitizeString, isValidEmail, checkRateLimit } from '../../utils/security';
import { TOOLS } from '../../data/tools';
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldCheck } from 'lucide-react';

export type SupportPageType = 'report-problem' | 'suggest-tool';

export const SupportPage: React.FC<{ type: SupportPageType }> = ({ type }) => {
  const { showToast } = useToast();
  const isReport = type === 'report-problem';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    selectedTool: '',
    suggestedToolName: '',
    category: 'Finance',
    description: '',
    stepsToReproduce: '',
    browserDevice: '',
    consent: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    updateSeoMetadata({
      title: isReport ? 'Report a Problem – India Smart Tools' : 'Suggest a Tool – India Smart Tools',
      description: isReport
        ? 'Report calculation discrepancies, visual glitches, or device errors on India Smart Tools.'
        : 'Request a new online calculator, document utility, or academic tool for India Smart Tools.',
      canonicalPath: `/support/${type}`,
      jsonLd: getBreadcrumbListSchema([
        { name: 'Home', item: '/' },
        { name: 'Support', item: '/support/report-problem' },
        { name: isReport ? 'Report a Problem' : 'Suggest a Tool', item: `/support/${type}` }
      ])
    });
  }, [type, isReport]);

  const validate = () => {
    const errs: Record<string, string> = {};
    const cleanName = sanitizeString(formData.name, 100);
    const cleanEmail = sanitizeString(formData.email, 254);
    const cleanSuggestedName = sanitizeString(formData.suggestedToolName, 100);
    const cleanDesc = sanitizeString(formData.description, 5000);

    // Data minimization: Name is optional
    if (cleanName && cleanName.length < 2) {
      errs.name = 'If provided, name must be at least 2 characters.';
    }

    // Data minimization: Email is optional unless they want a response
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com) or leave blank.';
    }

    if (isReport) {
      if (!cleanDesc || cleanDesc.length < 15) {
        errs.description = 'Please describe the issue in at least 15 characters.';
      }
    } else {
      if (!cleanSuggestedName) {
        errs.suggestedToolName = 'Please specify the tool name you would like added (max 100 chars).';
      }
      if (!cleanDesc || cleanDesc.length < 15) {
        errs.description = 'Please explain how this tool will benefit users (at least 15 characters).';
      }
    }

    if (!formData.consent) {
      errs.consent = 'Please confirm your consent for our team to review this feedback.';
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check submission rate limit (5s cooldown)
    const rateCheck = checkRateLimit(`support_${type}`, 5000);
    if (!rateCheck.allowed) {
      showToast(`Please wait ${rateCheck.remainingSeconds}s before submitting again.`, 'error');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(
        isReport ? 'Thank you! Your bug report has been logged.' : 'Thank you! Tool suggestion submitted.',
        'success'
      );
    }, 600);
  };

  return (
    <PageContainer maxWidth="4xl">
      <Breadcrumb
        items={[
          { label: 'Support', href: '/support/report-problem' },
          { label: isReport ? 'Report a Problem' : 'Suggest a Tool', href: `/support/${type}` }
        ]}
        className="mb-6"
      />

      <div className="space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Community Feedback & Quality
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {isReport ? 'Report a Problem' : 'Suggest a New Tool'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            {isReport
              ? 'Found an issue with a formula, layout anomaly, or device incompatibility? Let us know so our engineering team can investigate.'
              : 'Is there a specific Indian calculator, document converter, or academic tool you need? Tell us what you would like built.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {isReport ? 'Bug Report Received' : 'Suggestion Submitted'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for contributing to India Smart Tools. Your submission helps improve the platform for thousands of everyday users across India.
              </p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      selectedTool: '',
                      suggestedToolName: '',
                      category: 'Finance',
                      description: '',
                      stepsToReproduce: '',
                      browserDevice: '',
                      consent: false
                    });
                  }}
                >
                  Submit Another Feedback
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Optional Contact Details (Data Minimization) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Contact Information (Optional — Anonymous Submissions Welcome)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="support-name"
                    label="Your Name (Optional)"
                    placeholder="e.g. Priyanshu Sharma"
                    value={formData.name}
                    maxLength={100}
                    onChange={e => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                    error={errors.name}
                    helperText="Optional"
                  />

                  <Input
                    id="support-email"
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="e.g. priyanshu@example.com"
                    value={formData.email}
                    maxLength={254}
                    onChange={e => setFormData({ ...formData, email: e.target.value.slice(0, 254) })}
                    error={errors.email}
                    helperText="Only needed if you would like a reply"
                  />
                </div>
              </div>

              {/* Bug Specific vs Suggestion Specific Fields */}
              {isReport ? (
                <>
                  <div>
                    <label htmlFor="support-tool-select" className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-tight">
                      Which tool has the problem? (Optional)
                    </label>
                    <select
                      id="support-tool-select"
                      value={formData.selectedTool}
                      onChange={e => setFormData({ ...formData, selectedTool: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                    >
                      <option value="">General Platform Issue</option>
                      {TOOLS.map(t => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="support-desc" className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-tight">
                      Describe the problem <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="support-desc"
                      rows={4}
                      required
                      aria-required="true"
                      aria-invalid={errors.description ? 'true' : 'false'}
                      aria-describedby={errors.description ? 'support-desc-error' : undefined}
                      value={formData.description}
                      maxLength={5000}
                      onChange={e => setFormData({ ...formData, description: e.target.value.slice(0, 5000) })}
                      placeholder="What happened? What did you expect to happen instead? (at least 15 characters)..."
                      className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                        errors.description ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.description && (
                      <p id="support-desc-error" role="alert" className="mt-1 text-xs text-red-600 font-medium">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="support-steps"
                      label="Steps to Reproduce (Optional)"
                      placeholder="e.g. 1. Enter ₹50,000 CTC. 2. Click compute."
                      value={formData.stepsToReproduce}
                      maxLength={1000}
                      onChange={e => setFormData({ ...formData, stepsToReproduce: e.target.value.slice(0, 1000) })}
                    />

                    <Input
                      id="support-browser"
                      label="Browser / Device (Optional)"
                      placeholder="e.g. Chrome on Android, iPhone Safari"
                      value={formData.browserDevice}
                      maxLength={200}
                      onChange={e => setFormData({ ...formData, browserDevice: e.target.value.slice(0, 200) })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Input
                    id="suggest-tool-name"
                    label="Suggested Tool Name"
                    required
                    placeholder="e.g. Sukanya Samriddhi Yojana (SSY) Calculator"
                    value={formData.suggestedToolName}
                    maxLength={100}
                    onChange={e => setFormData({ ...formData, suggestedToolName: e.target.value.slice(0, 100) })}
                    error={errors.suggestedToolName}
                  />

                  <div>
                    <label htmlFor="suggest-category" className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-tight">
                      Target Category
                    </label>
                    <select
                      id="suggest-category"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                    >
                      <option value="Finance">Finance Tools</option>
                      <option value="Student">Student Tools</option>
                      <option value="Documents">Document Tools</option>
                      <option value="Everyday">Everyday Tools</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="suggest-desc" className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-tight">
                      Why is this tool needed & how will it work? <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="suggest-desc"
                      rows={5}
                      required
                      aria-required="true"
                      aria-invalid={errors.description ? 'true' : 'false'}
                      aria-describedby={errors.description ? 'suggest-desc-error' : undefined}
                      value={formData.description}
                      maxLength={5000}
                      onChange={e => setFormData({ ...formData, description: e.target.value.slice(0, 5000) })}
                      placeholder="Explain what inputs the user gives and what calculation outputs or files it should produce (at least 15 characters)..."
                      className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                        errors.description ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.description && (
                      <p id="suggest-desc-error" role="alert" className="mt-1 text-xs text-red-600 font-medium">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Explicit Consent Checkbox */}
              <div className="pt-2">
                <div className="flex items-start gap-3">
                  <input
                    id="support-consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                    aria-required="true"
                    aria-invalid={errors.consent ? 'true' : 'false'}
                    aria-describedby={errors.consent ? 'support-consent-error' : undefined}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <label htmlFor="support-consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                    I consent to India Smart Tools reviewing this feedback to improve the platform. Submitted data will not be shared publicly or used for marketing. <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                </div>
                {errors.consent && (
                  <p id="support-consent-error" role="alert" className="mt-1 text-xs text-red-600 font-medium">
                    {errors.consent}
                  </p>
                )}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Submissions are rate-limited to prevent abuse.
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  icon={isReport ? <AlertTriangle className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                >
                  {isReport ? 'Submit Bug Report' : 'Submit Tool Suggestion'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
