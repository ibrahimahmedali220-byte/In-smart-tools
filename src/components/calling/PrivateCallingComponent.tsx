import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  PhoneCall,
  PhoneOff,
  PhoneForwarded,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Radio,
  MicOff,
  Volume2,
  KeyRound,
  Info,
  Clock,
  Ban,
  AlertOctagon,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { Link } from '../../router/Router';

export const PrivateCallingComponent: React.FC = () => {
  const { showToast } = useToast();
  const [activeCallDemoState, setActiveCallDemoState] = useState<'idle' | 'simulated'>('idle');

  const handleSimulatedClick = () => {
    showToast('Preview mode: Real calling and OTP are coming soon and not active.', 'info');
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* 1. Hero / Coming Soon Announcement Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-10 md:p-12 border border-slate-700 shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold tracking-wider uppercase">
            <span>🚀 COMING SOON</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 shrink-0" />
              <span>Private Calling</span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-sky-200/90">
              Your number stays private.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Connect with someone without revealing your personal phone number. Smartly Tools is building a secure masked-calling system using authorized calling infrastructure.
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-xs text-slate-300 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">Development Notice:</strong> We&apos;re working on a secure and privacy-focused calling experience. Real calling will be enabled after the required verification, telecom provider, security, and compliance systems are ready.
            </p>
          </div>
        </div>
      </div>

      {/* 2. How It Will Work (3-Step Visual Process) */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            How It Will Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            A simple, transparent 3-step privacy workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-3 relative shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Step 1: Verify</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Verify your phone number with a secure OTP to confirm legitimate ownership and prevent spam.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-3 relative shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Step 2: Private Connection</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your real phone number stays hidden from the other participant. A temporary masked proxy number routes the conversation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-3 relative shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Step 3: Call</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect seamlessly through an authorized calling provider with carrier-grade audio quality and encryption.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>OTP verification and real calling are currently unavailable. This feature is coming soon.</span>
        </div>
      </section>

      {/* 3. Future User Experience & Future Call Screen Preview (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left: Disabled Future Interface Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Future Interface Preview
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Non-functional visual model</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              DISABLED IN PREVIEW
            </span>
          </div>

          <div className="space-y-4 opacity-75">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Phone Number
              </label>
              <div className="w-full h-11 px-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center text-xs sm:text-sm text-slate-400 font-mono select-none cursor-not-allowed">
                +91 XXXXX XXXXX
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Kept confidential and never shown to receiver.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Receiver Phone Number
              </label>
              <div className="w-full h-11 px-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center text-xs sm:text-sm text-slate-400 font-mono select-none cursor-not-allowed">
                +91 XXXXX XXXXX
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Will receive the call from a licensed proxy number.</p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled
                onClick={handleSimulatedClick}
                className="w-full py-3 px-4 bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 font-bold text-xs sm:text-sm rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
              >
                <Lock className="w-4 h-4" />
                <span>Verify & Start Private Call</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">COMING SOON — Calling is not available yet.</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">Zero phone numbers are collected or submitted in this preview version. No live calling APIs are connected.</p>
            </div>
          </div>
        </div>

        {/* Right: Future Call Screen & OTP Flow Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Call Screen Card */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-5 text-center shadow-md">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Masked Call Simulation
              </span>
              <span>Encrypted</span>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center mx-auto border border-slate-700">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Private Call</h3>
              <p className="text-xs text-sky-400 font-medium">Connecting...</p>
              <p className="text-xl font-mono font-bold tracking-widest text-slate-400">00:00</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSimulatedClick}
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Mute (Preview)"
              >
                <MicOff className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSimulatedClick}
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Speaker (Preview)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSimulatedClick}
                className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                title="End Call (Preview)"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Preview only — real calling is coming soon.
            </p>
          </div>

          {/* OTP Visual Flow */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-3 text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Future OTP Verification Flow</span>
            </h4>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
              <span>Phone</span>
              <span>→</span>
              <span>Send OTP</span>
              <span>→</span>
              <span>Enter OTP</span>
              <span>→</span>
              <span>Verified</span>
              <span>→</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Call</span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              SMS verification will be added when the production calling system is ready. No telecom credentials or SMS services are active in this version.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Privacy Features ("Built With Privacy in Mind") */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Built With Privacy in Mind
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Privacy-first engineering principles guiding our voice communication platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">🔒 Number Privacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your personal number will not be intentionally exposed to the other participant. Both parties interact through dynamic proxy routing.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">🛡️ Abuse Protection</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rate limits, blocking, reporting, and anti-abuse controls will be required to ensure legitimate, respectful communication.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">🔐 Secure Sessions</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calling sessions will use secure backend infrastructure with automated timeouts and isolated connection tokens.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Ban className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">🚫 No Caller-ID Spoofing</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We will only use authorized caller/proxy numbers. Random or unauthorized caller IDs will never be generated or permitted.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Safety & Abuse Prevention ("Safety First") */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-6 text-left border border-slate-800 shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" /> Safety First
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Comprehensive Safety & Abuse Controls
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Private Calling is intended for legitimate communication only. Spam, harassment, fraud, threats, impersonation, and illegal use will strictly not be allowed.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {[
            'Phone Verification',
            'Rate Limiting',
            'Call Duration Limits',
            'Spam Protection',
            'Block User / Number',
            'Report Abuse',
            'Scam Reporting',
            'Harassment Reporting',
            'Suspicious Activity Detection',
            'Temporary Restrictions',
            'Secure Session Management',
            'Zero Caller Spoofing'
          ].map(item => (
            <div
              key={item}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-200 flex items-start gap-2.5">
          <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white font-semibold">Emergency Notice:</strong> Private Calling is not an emergency calling service. For life-threatening emergencies, police, fire, or ambulance, always dial <strong>112 / 100</strong> directly from your telecom dialer.
          </p>
        </div>
      </section>

      {/* 6. Legal & Policy Quick Access */}
      <section className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Policies & Abuse Reporting</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <Link
            to="/privacy-policy"
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="/support/report-problem"
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            Report Abuse / Feedback
          </Link>
        </div>
      </section>
    </div>
  );
};
