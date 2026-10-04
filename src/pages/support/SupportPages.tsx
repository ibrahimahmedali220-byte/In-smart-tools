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
      title: isReport ? 'Report a Problem – Smartly Tools' : 'Suggest a Tool – Smartly Tools',
      description: isReport
        ? 'Report calculation discrepancies, visual glitches, or device errors on Smartly Tools.'
        : 'Request a new online calculator, document utility, or academic tool for Smartly Tools.',
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

    // Email is optional on support reports unless they want a reply
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      errs.email = 'Please provide a valid email format or leave blank.';
    }

    if (!isReport) {
      if (!cleanSuggestedName || cleanSuggestedName.length < 3) {
        errs.suggestedToolName = 'Please enter a tool title of at least 3 characters.';
      }
    }

    if (!cleanDesc || cleanDesc.length < 15) {
      errs.description = 'Please provide at least 15 characters describing your request.';
    }

    if (!formData.consent) {
      errs.consent = 'You must acknowledge the data handling consent to submit.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client rate-limiting (5 submissions per 10 minutes)
    const rateLimit = checkRateLimit('support_form_submits', 5, 600000);
    if (!rateLimit.allowed) {
      showToast(`Too many submissions. Please wait ${Math.ceil(rateLimit.resetIn / 60000)} minutes.`, 'error');
      return;
    }

    if (!validate()) {
      showToast('Please correct the errors in the form before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate safe local form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(isReport ? 'Problem report received.' : 'Tool suggestion logged.', 'success');
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
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isReport ? 'Quality & Reliability' : 'Community Feature Requests'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1 flex items-center gap-3">
            {isReport ? (
              <>
                <AlertTriangle className="w-8 h-8 text-amber-500" aria-hidden="true" />
                <span>Report a Problem</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-8 h-8 text-amber-500" aria-hidden="true" />
                <span>Suggest a New Tool</span>
              </>
            )}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {isReport
              ? 'Found a calculation mismatch, broken export, or layout glitch? Let us know so our team can resolve it.'
              : 'Have an idea for a financial formula, university converter, or utility? Submit your idea for implementation.'}
          </p>
        </div>

        {/* Support Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 transition-colors">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isReport ? 'Bug Report Submitted' : 'Suggestion Submitted'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for contributing to the quality and expansion of Smartly Tools. We review all feedback regularly at kmnurbusiness@gmail.com.
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
                  Submit Another Entry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {isReport ? 'Problem Details' : 'Tool Specification'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill in the details below. Personal identifying information is completely optional.
                </p>
              </div>

              {/* User Identity Details (Data Minimization: Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="support-name"
                  label="Your Name (Optional)"
                  placeholder="e.g. Priyanshu Sharma"
                  value={formData.name}
                  maxLength={100}
                  onChange={e => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                  error={errors.name}
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

              {/* Bug Specific vs Suggestion Specific Fields */}
              {isReport ? (
                <>
                  <div>
                    <label htmlFor="support-tool-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-tight">
                      Which tool has the problem? (Optional)
                    </label>
                    <select
                      id="support-tool-select"
                      value={formData.selectedTool}
                      onChange={e => setFormData({ ...formData, selectedTool: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-400 cursor-pointer min-h-[42px]"
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
                    <label htmlFor="support-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-tight">
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
                      className={`w-full rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-400 ${
                        errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                    {errors.description && (
                      <p id="support-desc-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        id="support-suggested-name"
                        label="Suggested Tool Title"
                        required
                        placeholder="e.g. Compound Interest vs Simple Interest Calculator"
                        value={formData.suggestedToolName}
                        maxLength={100}
                        onChange={e => setFormData({ ...formData, suggestedToolName: e.target.value.slice(0, 100) })}
                        error={errors.suggestedToolName}
                      />
                    </div>

                    <div>
                      <label htmlFor="support-category-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-tight">
                        Target Category
                      </label>
                      <select
                        id="support-category-select"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-400 cursor-pointer min-h-[42px]"
                      >
                        <option value="Finance">Finance Tools</option>
                        <option value="Student">Student Tools</option>
                        <option value="Documents">Document Tools</option>
                        <option value="Everyday">Everyday Tools</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="support-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-tight">
                      What should this tool do? <span className="text-red-500" aria-hidden="true">*</span>
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
                      placeholder="Explain the formula, user scenario, or portal rules for this utility (at least 15 characters)..."
                      className={`w-full rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-900 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-400 ${
                        errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                    {errors.description && (
                      <p id="support-desc-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Consent check */}
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
                    className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-slate-900 dark:text-sky-500 focus:ring-slate-900 cursor-pointer"
                  />
                  <label htmlFor="support-consent" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">
                    I agree to share this feedback with the engineering team for platform improvement. I understand that any email provided will be used exclusively for communication regarding this submission. <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                </div>
                {errors.consent && (
                  <p id="support-consent-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Submissions are strictly private and never published without permission.</span>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
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
