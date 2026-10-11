import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SearchTools } from '../components/common/SearchTools';
import { CategoryCard } from '../components/common/CategoryCard';
import { ToolCard } from '../components/common/ToolCard';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { CATEGORIES, TOOLS } from '../data/tools';
import { Link, useRouter } from '../router/Router';
import { updateSeoMetadata, getWebSiteSchema, getFaqPageSchema } from '../utils/seo';
import { ShieldCheck, Zap, Laptop, ArrowRight, Star, History, Trash2, Clock, HelpCircle, Rocket } from 'lucide-react';
import { useUserPreferences } from '../hooks/useUserPreferences';

// 3D Isometric Holographic Tech Illustration for Left Hero (Pure SVG + CSS)
const HeroLaptopIllustration: React.FC = () => (
  <div className="hidden xl:block absolute left-2 2xl:left-10 top-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none select-none animate-float-gentle z-0">
    <div className="relative w-full h-full">
      {/* Outer Glow Halo */}
      <div className="absolute inset-4 bg-gradient-to-tr from-blue-600/30 to-cyan-400/20 rounded-full blur-2xl" />

      {/* SVG 3D Laptop */}
      <svg viewBox="0 0 280 260" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,180,255,0.35)]" fill="none">
        <defs>
          <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A42" />
            <stop offset="50%" stopColor="#081433" />
            <stop offset="100%" stopColor="#03091B" />
          </linearGradient>
          <linearGradient id="laptopBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C8FF" />
            <stop offset="100%" stopColor="#168BFF" />
          </linearGradient>
          <linearGradient id="keyboardBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13275A" />
            <stop offset="100%" stopColor="#071026" />
          </linearGradient>
          <linearGradient id="neonGlowLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C8FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#168BFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Ring */}
        <ellipse cx="140" cy="205" rx="120" ry="28" stroke="url(#laptopBevel)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
        
        {/* Laptop Screen Body */}
        <polygon points="50,60 230,60 215,160 65,160" fill="url(#laptopScreen)" stroke="url(#laptopBevel)" strokeWidth="2.5" />
        {/* Inner Screen Display */}
        <polygon points="58,68 222,68 209,152 71,152" fill="#06112C" />
        
        {/* UI holographic lines on screen */}
        <line x1="80" y1="85" x2="160" y2="85" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="80" y1="95" x2="190" y2="95" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <rect x="80" y="105" width="40" height="26" rx="4" fill="#0E2254" stroke="#00C8FF" strokeWidth="1" opacity="0.8" />
        <rect x="130" y="105" width="40" height="26" rx="4" fill="#141E48" stroke="#818CF8" strokeWidth="1" opacity="0.8" />
        <rect x="180" y="105" width="22" height="26" rx="4" fill="#1C1844" stroke="#F43F5E" strokeWidth="1" opacity="0.8" />

        {/* Laptop Keyboard Deck (Isometric Base) */}
        <polygon points="35,165 245,165 220,215 60,215" fill="url(#keyboardBase)" stroke="#1E3A8A" strokeWidth="2" />
        {/* Keyboard keys area */}
        <polygon points="55,172 225,172 205,198 75,198" fill="#0A1633" stroke="#2563EB" strokeWidth="1" opacity="0.7" />
        {/* Touchpad */}
        <polygon points="120,202 160,202 155,212 125,212" fill="#122552" stroke="#38BDF8" strokeWidth="1" opacity="0.8" />
        {/* Front glowing edge light */}
        <path d="M60,215 L220,215" stroke="url(#neonGlowLine)" strokeWidth="3" />
      </svg>

      {/* Floating 3D Holographic Badges */}
      <div className="absolute top-2 left-6 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-cyan-400/60 shadow-[0_0_18px_rgba(22,139,255,0.8)] flex items-center justify-center text-white transform -rotate-6">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="8.01" y2="10" />
          <line x1="12" y1="10" x2="12.01" y2="10" />
          <line x1="16" y1="10" x2="16.01" y2="10" />
          <line x1="8" y1="14" x2="8.01" y2="14" />
          <line x1="12" y1="14" x2="12.01" y2="14" />
          <line x1="16" y1="14" x2="16.01" y2="14" />
          <line x1="8" y1="18" x2="8.01" y2="18" />
          <line x1="12" y1="18" x2="16" y2="18" />
        </svg>
      </div>

      <div className="absolute top-1 right-6 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-purple-400/60 shadow-[0_0_16px_rgba(168,85,247,0.8)] flex items-center justify-center text-white transform rotate-12">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>

      <div className="absolute bottom-6 right-2 w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 border border-cyan-300/60 shadow-[0_0_14px_rgba(6,182,212,0.8)] flex items-center justify-center text-white transform -rotate-12">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </div>
    </div>
  </div>
);

// 3D Celestial Planet Illustration for Right Hero (Pure SVG + CSS)
const HeroPlanetIllustration: React.FC = () => (
  <div className="hidden xl:block absolute right-2 2xl:right-10 top-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none select-none animate-float-reverse z-0">
    <div className="relative w-full h-full">
      {/* Outer Glow Halo */}
      <div className="absolute inset-4 bg-gradient-to-tr from-cyan-400/25 via-blue-600/30 to-purple-600/20 rounded-full blur-2xl" />

      {/* SVG 3D Globe with Ashoka Chakra Emblem & Indian Tricolor Aura */}
      <svg viewBox="0 0 280 280" className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,180,255,0.4)]" fill="none">
        <defs>
          <radialGradient id="globeGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="35%" stopColor="#0284C7" />
            <stop offset="70%" stopColor="#0F2F6D" />
            <stop offset="100%" stopColor="#040D26" />
          </radialGradient>
          <linearGradient id="orbitRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="indiaSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FF7700" />
          </linearGradient>
          <linearGradient id="indiaGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#138808" />
            <stop offset="100%" stopColor="#107507" />
          </linearGradient>
        </defs>

        {/* Orbital Ring Back Arc */}
        <ellipse cx="140" cy="140" rx="125" ry="42" transform="rotate(-28 140 140)" stroke="url(#orbitRing)" strokeWidth="3" strokeDasharray="4 2" opacity="0.6" />

        {/* 3D Globe Sphere */}
        <circle cx="140" cy="140" r="74" fill="url(#globeGrad)" />

        {/* Atmospheric Rim Glow */}
        <circle cx="140" cy="140" r="74" stroke="#38BDF8" strokeWidth="2.5" opacity="0.8" />

        {/* Stylized Tricolor Band Arc across globe */}
        <path d="M78,125 C100,105 160,102 202,126" stroke="url(#indiaSaffron)" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
        <path d="M74,136 C100,116 160,113 206,137" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
        <path d="M70,147 C100,127 160,124 210,148" stroke="url(#indiaGreen)" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />

        {/* Ashoka Chakra Center Silhouette */}
        <circle cx="140" cy="125" r="9" stroke="#000080" strokeWidth="1.5" fill="#FFFFFF" />
        <circle cx="140" cy="125" r="2.5" fill="#000080" />
        <g stroke="#000080" strokeWidth="0.8">
          <line x1="140" y1="117" x2="140" y2="133" />
          <line x1="132" y1="125" x2="148" y2="125" />
          <line x1="134" y1="119" x2="146" y2="131" />
          <line x1="134" y1="131" x2="146" y2="119" />
        </g>

        {/* Orbital Ring Front Arc */}
        <path d="M30,178 C65,225 210,210 250,110" stroke="url(#orbitRing)" strokeWidth="3.5" strokeLinecap="round" />
      </svg>

      {/* Floating Orbital Badges */}
      <div className="absolute top-8 right-6 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-300/70 shadow-[0_0_16px_rgba(0,200,255,0.8)] flex items-center justify-center text-white transform rotate-12">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="8.01" y2="10" />
          <line x1="12" y1="10" x2="12.01" y2="10" />
          <line x1="16" y1="10" x2="16.01" y2="10" />
          <line x1="8" y1="14" x2="8.01" y2="14" />
          <line x1="12" y1="14" x2="12.01" y2="14" />
          <line x1="16" y1="14" x2="16.01" y2="14" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-4 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-sky-400/70 shadow-[0_0_16px_rgba(37,99,235,0.8)] flex items-center justify-center text-white transform -rotate-12">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
    </div>
  </div>
);

const HOMEPAGE_FAQS = [
  {
    q: 'What is Smartly Tools?',
    a: 'Smartly Tools is a free online platform providing fast, privacy-first web utilities and digital tools for everyday tasks, including loan calculators, image compressors, PDF converters, and unit calculators.'
  },
  {
    q: 'Are Smartly Tools free?',
    a: 'Yes, every tool on Smartly Tools is 100% free to use. There are no subscriptions, hidden fees, or paywalls.'
  },
  {
    q: 'What types of free online tools are available on Smartly Tools?',
    a: 'Smartly Tools offers a wide variety of free online tools across four main categories: everyday utilities (QR generator, password generator, unit converter), document tools (PDF compressor, image resizer, JPG to PDF), financial calculators (EMI, SIP, GST, FD, salary), and academic aids (percentage calculator, CGPA converter, study timer).'
  },
  {
    q: 'How do I use an online calculator?',
    a: 'Simply select your calculator from the directory, type your values into the input fields, and view immediate results. You can also view step-by-step calculation formulas and practical examples.'
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. You do not need to register, create an account, or share personal contact information to access any tool.'
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. All document conversions, PDF operations, and calculations run client-side directly in your browser. Your sensitive files and private inputs never leave your device.'
  },
  {
    q: 'Can I use Smartly Tools on mobile and offline?',
    a: 'Yes. Smartly Tools is responsive and works as an installable Progressive Web App (PWA) on both Android and iOS devices, retaining functionality even without internet.'
  }
];

export const HomePage: React.FC = () => {
  const { favoriteTools, recentTools, recentSearches, removeSearch, clearRecentSearches, clearRecentTools } = useUserPreferences();
  const { navigate } = useRouter();

  useEffect(() => {
    updateSeoMetadata({
      title: 'Smartly Tools – Free Online Tools for Everyday Tasks',
      description: 'Smartly Tools provides free online tools for everyday tasks, including calculators, converters, generators and other useful web tools.',
      canonicalPath: '/',
      jsonLd: [
        getWebSiteSchema(),
        getFaqPageSchema(HOMEPAGE_FAQS)
      ]
    });
  }, []);

  // Curate 6 high-utility tools with QR Generator & JPG to PDF at top followed by Finance
  const featuredTools = ['qr-generator', 'jpg-to-pdf', 'emi-calculator', 'sip-calculator', 'percentage-calculator', 'age-calculator']
    .map(slug => TOOLS.find(t => t.slug === slug))
    .filter(Boolean) as typeof TOOLS;

  // Last accessed tools for quick access (up to 4 matching reference image)
  const lastRecentTools = recentTools.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-slate-50 dark:from-[#050B1D] dark:via-[#08122B] dark:to-[#050B1D] border-b border-slate-200/80 dark:border-blue-950/80 pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Layered Radiant Glows */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/15 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-purple-600/15 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Decorative Floating Graphics on left & right */}
        <HeroLaptopIllustration />
        <HeroPlanetIllustration />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
            Free Online Tools for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,200,255,0.4)]">
              Everyday Tasks
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-600 dark:text-[#A8B5CC] max-w-2xl mx-auto leading-relaxed">
            Fast, free, and privacy-conscious online utilities designed for students, job applicants, creators, and everyday productivity.
          </p>

          {/* Prominent Global Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto text-left">
            <SearchTools
              variant="inline"
              placeholder="Search by tool name or keyword (e.g. qr, pdf, loan, photo, gst)..."
            />
          </div>

          {/* User's Recent Search History Bar (Local Storage) */}
          {recentSearches.length > 0 && (
            <div className="mt-4 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-[#A8B5CC] animate-in fade-in duration-150">
              <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400 dark:text-cyan-400" /> Recent searches:
              </span>
              {recentSearches.map(term => (
                <div
                  key={term}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-[#0C1736] hover:bg-slate-100 dark:hover:bg-[#12224A] border border-slate-200 dark:border-blue-900/60 rounded-lg text-slate-700 dark:text-slate-200 transition-colors shadow-2xs group"
                >
                  <Link
                    to={`/tools?q=${encodeURIComponent(term)}`}
                    className="font-medium hover:text-slate-950 dark:hover:text-cyan-300"
                  >
                    {term}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeSearch(term)}
                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 ml-0.5 cursor-pointer hover:scale-125 active:scale-90 transition-transform duration-150"
                    title={`Remove "${term}" from recent searches`}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[11px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline ml-1 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-150"
                title="Clear all recent searches"
              >
                Clear
              </button>
            </div>
          )}

          {/* Quick Category Jump Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="text-slate-400 dark:text-slate-500 font-medium mr-1">Quick categories:</span>
            {CATEGORIES.map((category, idx) => {
              const isFirst = idx === 0;
              return (
                <Link
                  key={category.id}
                  to={category.route}
                  className={
                    isFirst
                      ? "px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(22,139,255,0.6)] hover:shadow-[0_0_24px_rgba(0,200,255,0.8)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer"
                      : "px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-[#0D1836] text-slate-700 dark:text-[#A8B5CC] border border-slate-200/80 dark:border-blue-900/60 hover:dark:border-cyan-400/80 hover:dark:text-white hover:shadow-[0_0_12px_rgba(0,200,255,0.3)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer"
                  }
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <PageContainer className="space-y-16 sm:space-y-20">
        
        {/* PWA Install Promo Card (suppresses automatically if installed or unsupported) */}
        <PWAInstallButton variant="card" />

        {/* Dedicated "Recently Used" Section (Stores last accessed tools in localStorage) */}
        {lastRecentTools.length > 0 && (
          <section className="relative bg-white/90 dark:bg-gradient-to-b dark:from-[#0B1736]/90 dark:to-[#070F26]/90 backdrop-blur-md rounded-3xl border border-slate-200/90 dark:border-blue-900/70 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-[0_12px_40px_-10px_rgba(2,6,23,0.7)] overflow-hidden">
            {/* Top Curved Luminous Highlight Line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 dark:border-blue-900/60 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,200,255,0.4)] shrink-0">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Recently Used Tools
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#A8B5CC]">
                    Your last {lastRecentTools.length} accessed {lastRecentTools.length === 1 ? 'tool' : 'tools'} stored locally for quick access.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearRecentTools}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-[#A8B5CC] dark:hover:text-red-400 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                  title="Clear recently accessed tools history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
                <Link
                  to="/tools"
                  className="group text-xs font-semibold text-slate-700 dark:text-cyan-400 hover:text-slate-950 dark:hover:text-cyan-300 hover:translate-x-0.5 active:scale-95 transition-all duration-150 inline-flex items-center gap-1"
                >
                  <span>All Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {lastRecentTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} isRecent={true} />
              ))}
            </div>
          </section>
        )}

        {/* Section 1: Free Online Tools */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-cyan-400 mb-1">
                <Rocket className="w-3.5 h-3.5" />
                <span>Handy Web Utilities</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Free Online{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                  Tools
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B5CC] mt-1">
                Explore popular free online tools including QR Code Generator, JPG to PDF converter, and financial calculators.
              </p>
            </div>
            <Link
              to="/tools"
              className="group inline-flex items-center text-xs font-semibold text-slate-800 dark:text-cyan-400 hover:text-slate-950 dark:hover:text-cyan-300 gap-1 hover:translate-x-0.5 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <span>Browse all tools</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Favorites Section (if user has favorites) */}
        {favoriteTools.length > 0 && (
          <section className="bg-slate-50/80 dark:bg-[#0B1736] rounded-2xl border border-slate-200/90 dark:border-blue-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-blue-900/60">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Your Starred Favorites
                </h2>
              </div>
              <Link
                to="/tools"
                className="group text-xs font-semibold text-slate-700 dark:text-cyan-400 hover:text-slate-950 dark:hover:text-cyan-300 hover:translate-x-0.5 active:scale-95 transition-all duration-150 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Manage in Directory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-150" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {favoriteTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Browse by Category */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Explore Tool Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8B5CC] mt-1">
                Structured suites organized for your daily work and studies.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center text-xs font-semibold text-slate-800 dark:text-cyan-400 hover:text-slate-950 dark:hover:text-cyan-300 gap-1 transition-colors"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map(category => (
              <CategoryCard
                key={category.id}
                category={{
                  ...category,
                  toolCount: TOOLS.filter(t => t.category === category.id).length
                }}
              />
            ))}
          </div>
        </section>

        {/* Section: What is Smartly Tools & How to Use Smartly Tools */}
        <section className="bg-white dark:bg-[#0B1736] rounded-2xl border border-slate-200/90 dark:border-blue-900/60 p-8 sm:p-10 md:p-12 transition-colors shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
                Overview
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                What is Smartly Tools?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                Smartly Tools is a dedicated collection of free online tools built to solve everyday tasks with maximum speed and absolute privacy. Designed for students, job applicants, creators, and everyday productivity, our free online tools provide calculators, converters, image compressors, and PDF tools without subscription walls or complicated interfaces.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                Every utility is engineered to execute directly inside your web browser using client-side algorithms. This means calculations happen in milliseconds, document compression runs on your own device, and your private data never touches remote servers.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
                Process
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                How to Use Smartly Tools
              </h2>
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#12224A] text-slate-900 dark:text-cyan-300 border border-slate-200 dark:border-blue-800 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">Pick a Tool:</strong> Search by keyword or explore categories like Finance, Documents, Student, or Everyday free online tools.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#12224A] text-slate-900 dark:text-cyan-300 border border-slate-200 dark:border-blue-800 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">Input Your Data:</strong> Type in your figures, paste text, or select local files for instant processing.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#12224A] text-slate-900 dark:text-cyan-300 border border-slate-200 dark:border-blue-800 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">Get Instant Results:</strong> View formatted outputs, copy answers to your clipboard, or download converted documents immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why Use Smartly Tools? */}
        <section className="bg-white dark:bg-[#0B1736] rounded-2xl border border-slate-200/90 dark:border-blue-900/60 p-8 sm:p-10 md:p-12 transition-colors shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
              Advantages
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Why Use Smartly Tools?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] mt-2 leading-relaxed">
              Smartly Tools delivers fast, private, and reliable free online tools engineered to solve everyday calculations and file operations without annoying sign-up walls, sluggish bloat, or data tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2 p-4 rounded-xl bg-slate-50/50 dark:bg-[#0E1E45]/40 border border-slate-200/50 dark:border-blue-900/40">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-[#12224A] text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Instant Execution</h3>
              <p className="text-xs text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                Clean client-optimized algorithms guarantee calculation results and preview rendering without waiting for server round-trips.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-50/50 dark:bg-[#0E1E45]/40 border border-slate-200/50 dark:border-blue-900/40">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-[#12224A] text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Client-First Privacy</h3>
              <p className="text-xs text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                Your certificates, photographs, salaries, and sensitive inputs stay secure on your device. We never store personal documents.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-50/50 dark:bg-[#0E1E45]/40 border border-slate-200/50 dark:border-blue-900/40">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-[#12224A] text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Laptop className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Offline & Installable</h3>
              <p className="text-xs text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                Works offline on mobile and desktop as a Progressive Web App (PWA) with zero internet requirement after caching.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Frequently Asked Questions */}
        <section className="bg-white dark:bg-[#0B1736] rounded-2xl border border-slate-200/90 dark:border-blue-900/60 p-8 sm:p-10 md:p-12 transition-colors shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
              Got Questions?
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] mt-2 leading-relaxed">
              Find quick answers to common questions about using Smartly Tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HOMEPAGE_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-50/70 dark:bg-[#0E1E45]/50 border border-slate-200/70 dark:border-blue-900/60 space-y-2"
              >
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B5CC] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </PageContainer>
    </div>
  );
};

