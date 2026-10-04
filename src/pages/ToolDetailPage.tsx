import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { IconResolver } from '../components/common/IconResolver';
import { ToolCard } from '../components/common/ToolCard';
import { Button } from '../components/common/Button';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { getToolBySlug, getCategoryById, getToolsByCategory, TOOLS } from '../data/tools';
import { Link } from '../router/Router';
import { updateSeoMetadata, getBreadcrumbListSchema, getWebApplicationSchema } from '../utils/seo';
import { safeClipboardCopy } from '../utils/security';
import { NotFoundPage } from './NotFoundPage';
import { useToast } from '../components/common/Toast';
import { BackButton } from '../components/common/BackButton';

// Financial Calculator Components (Part 6)
import { EmiCalculatorComponent } from '../components/calculators/EmiCalculatorComponent';
import { SipCalculatorComponent } from '../components/calculators/SipCalculatorComponent';
import { GstCalculatorComponent } from '../components/calculators/GstCalculatorComponent';
import { SalaryCalculatorComponent } from '../components/calculators/SalaryCalculatorComponent';
import { FdCalculatorComponent } from '../components/calculators/FdCalculatorComponent';

// Student Tools Components (Part 7)
import { PercentageCalculatorComponent } from '../components/calculators/student/PercentageCalculatorComponent';
import { CgpaCalculatorComponent } from '../components/calculators/student/CgpaCalculatorComponent';
import { AgeCalculatorComponent } from '../components/calculators/student/AgeCalculatorComponent';
import { StudyTimerComponent } from '../components/calculators/student/StudyTimerComponent';
import { WordCounterComponent } from '../components/calculators/student/WordCounterComponent';

// Document & Image Tools Components (Part 8)
import { JpgToPdfComponent } from '../components/calculators/documents/JpgToPdfComponent';
import { PdfToJpgComponent } from '../components/calculators/documents/PdfToJpgComponent';
import { PdfCompressorComponent } from '../components/calculators/documents/PdfCompressorComponent';
import { ImageCompressorComponent } from '../components/calculators/documents/ImageCompressorComponent';
import { ImageResizerComponent } from '../components/calculators/documents/ImageResizerComponent';

// Everyday Tools Components (Part 9)
import { QrGeneratorComponent } from '../components/calculators/everyday/QrGeneratorComponent';
import { PasswordGeneratorComponent } from '../components/calculators/everyday/PasswordGeneratorComponent';
import { UnitConverterComponent } from '../components/calculators/everyday/UnitConverterComponent';
import { DateDifferenceComponent } from '../components/calculators/everyday/DateDifferenceComponent';
import { BmiCalculatorComponent } from '../components/calculators/everyday/BmiCalculatorComponent';
import { PrivateCallingComponent } from '../components/calling/PrivateCallingComponent';

import {
  Layers,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Share2,
  HelpCircle,
  Calculator,
  AlertCircle,
  Star
} from 'lucide-react';
import { useUserPreferences } from '../hooks/useUserPreferences';

export interface ToolDetailPageProps {
  slug: string;
}

// Relevant internal links specified in Requirements 18, 19 & Parts 8-9
const SPECIFIED_RELATED_TOOLS: Record<string, string[]> = {
  // Finance (Part 6)
  'emi-calculator': ['sip-calculator', 'salary-calculator', 'fd-calculator'],
  'sip-calculator': ['emi-calculator', 'fd-calculator', 'salary-calculator'],
  'gst-calculator': ['salary-calculator'],
  'salary-calculator': ['emi-calculator', 'sip-calculator', 'fd-calculator'],
  'fd-calculator': ['sip-calculator', 'emi-calculator', 'salary-calculator'],

  // Student (Part 7)
  'percentage-calculator': ['cgpa-calculator', 'age-calculator'],
  'cgpa-calculator': ['percentage-calculator', 'study-timer'],
  'age-calculator': ['percentage-calculator', 'date-difference'],
  'study-timer': ['word-counter', 'percentage-calculator'],
  'word-counter': ['study-timer', 'password-generator'],

  // Documents & Images (Part 8)
  'jpg-to-pdf': ['pdf-to-jpg', 'pdf-compressor', 'image-compressor'],
  'pdf-to-jpg': ['jpg-to-pdf', 'pdf-compressor'],
  'pdf-compressor': ['pdf-to-jpg', 'jpg-to-pdf'],
  'image-compressor': ['image-resizer', 'jpg-to-pdf'],
  'image-resizer': ['image-compressor', 'jpg-to-pdf'],

  // Everyday (Part 9)
  'qr-generator': ['password-generator', 'unit-converter'],
  'password-generator': ['qr-generator', 'word-counter'],
  'unit-converter': ['percentage-calculator', 'date-difference', 'bmi-calculator'],
  'date-difference': ['age-calculator', 'unit-converter'],
  'bmi-calculator': ['unit-converter', 'age-calculator']
};

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ slug }) => {
  const tool = getToolBySlug(slug);
  const { showToast } = useToast();
  const { isFavorite, toggleFavorite, recordToolVisit } = useUserPreferences();

  const isFav = tool ? isFavorite(tool.id) : false;

  useEffect(() => {
    if (!tool) return;

    recordToolVisit(tool.id);

    const category = getCategoryById(tool.category);
    updateSeoMetadata({
      title: `${tool.name} – Free Online Tool for India`,
      description: tool.description,
      canonicalPath: tool.route,
      jsonLd: [
        getBreadcrumbListSchema([
          { name: 'Home', item: '/' },
          { name: 'Tools', item: '/tools' },
          { name: category ? category.name : tool.category, item: category ? category.route : '/tools' },
          { name: tool.name, item: tool.route }
        ]),
        getWebApplicationSchema(tool)
      ]
    });
  }, [tool, recordToolVisit]);

  if (!tool) {
    return <NotFoundPage />;
  }

  const category = getCategoryById(tool.category);

  // Derive related tools using specific mappings or category fallback
  const relatedSlugs = SPECIFIED_RELATED_TOOLS[tool.slug] || [];
  const relatedTools = relatedSlugs.length > 0
    ? relatedSlugs.map(s => getToolBySlug(s)).filter((t): t is NonNullable<typeof t> => !!t)
    : getToolsByCategory(tool.category).filter(t => t.id !== tool.id).slice(0, 3);

  const isImplementedTool = tool.status === 'implemented';

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const success = await safeClipboardCopy(url);
    if (success) {
      showToast('Tool link copied to clipboard!', 'success');
    } else {
      showToast('Unable to copy link', 'error');
    }
  };

  // Specific FAQs for category tools
  const categoryFaqs: Record<string, { q: string; a: string }[]> = {
    finance: [
      {
        q: 'Is this calculation based on standard Indian banking practices?',
        a: 'Yes. All financial formulas utilize the reducing-balance method, quarterly compounding intervals, and latest Income Tax regimes established in India.'
      },
      {
        q: 'Is any of my financial or salary data stored or sent to a server?',
        a: 'No. All calculations run 100% locally in your web browser. We never collect, transmit, or store any numbers you enter.'
      },
      {
        q: 'Can I use this tool offline on my phone or laptop?',
        a: 'Yes. India Smart Tools is an installable PWA. Once loaded, you can calculate EMIs, SIP returns, and GST offline without internet.'
      }
    ],
    student: [
      {
        q: 'What CGPA to percentage conversion formula is used?',
        a: 'The standard conversion multiplier is 9.5 (as benchmarked by CBSE and AICTE). You can also customize the multiplier if your university uses a different rule (e.g. 10.0 or 7.1).'
      },
      {
        q: 'Is text pasted into the Word Counter stored or shared?',
        a: 'Never. Text analysis runs completely in your browser memory and is never uploaded, logged, or sent to any server.'
      }
    ],
    documents: [
      {
        q: 'Are my uploaded certificates, signatures, or photos stored on your servers?',
        a: 'Never. All document and image operations execute client-side directly in your browser memory using HTML5 Canvas and pdf-lib. Your sensitive identity files never touch a remote server.'
      },
      {
        q: 'Will compressed images meet strict portal limits (e.g. <20 KB or <50 KB)?',
        a: 'Yes. Presets are specifically calibrated for government recruitment portals like UPSC, SSC, and state PSCs that require passport photos under 50 KB and signatures under 20 KB.'
      },
      {
        q: 'Is there a limit on how many images I can convert to PDF at once?',
        a: 'You can convert up to 25 images simultaneously, with individual file sizes up to 50 MB.'
      }
    ],
    everyday: [
      {
        q: 'Are generated QR codes compatible with all Indian UPI apps?',
        a: 'Yes. Generated UPI payment QR codes follow the standard NPCI specification and can be scanned with Google Pay, PhonePe, Paytm, BHIM, and bank apps.'
      }
    ]
  };

  const faqs = categoryFaqs[tool.category] || categoryFaqs.documents;

  // Formula & How it works documentation for implemented tools
  const toolFormulas: Record<string, { formula: string; explanation: string; steps: string[] }> = {
    'emi-calculator': {
      formula: 'EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1)',
      explanation: 'Where P is the principal loan amount, r is the periodic monthly interest rate (Annual Rate / 12 / 100), and n is the total number of monthly payments. This standard reducing-balance method ensures interest is charged strictly on the outstanding balance.',
      steps: [
        'Enter your desired loan amount (principal) using the input box or quick preset chips.',
        'Specify the annual interest rate offered by your bank or lending institution.',
        'Select your loan tenure in either years or months.',
        'Review your monthly installment, total interest payable, and the optional yearly amortization schedule.'
      ]
    },
    'sip-calculator': {
      formula: 'M = P × [(1 + i)ⁿ - 1] × (1 + i) / i',
      explanation: 'Where M is the accumulated final maturity amount, P is the monthly SIP installment, i is the periodic monthly return rate (Annual Return / 12 / 100), and n is the number of months. Compounding returns reward long-term discipline through rupee cost averaging.',
      steps: [
        'Enter the monthly amount you intend to invest through your mutual fund SIP.',
        'Provide your expected annual rate of return (long-term equity funds typically average 11%–14%).',
        'Choose your investment horizon in years or months.',
        'View the total amount you will invest vs. the estimated wealth gain produced by compounding.'
      ]
    },
    'gst-calculator': {
      formula: 'Add GST: Base + (Base × Rate / 100) | Remove GST: (Total × 100) / (100 + Rate)',
      explanation: 'The Goods and Services Tax in India is levied at standard tariff slabs (0%, 5%, 12%, 18%, 28%). For intra-state transactions within the same state, the tax amount is divided equally into CGST (50%) and SGST (50%). For inter-state supplies, IGST (100%) applies.',
      steps: [
        'Choose whether you want to "Add GST" to a net price or "Remove GST" from an inclusive invoice total.',
        'Enter the transaction amount in Indian Rupees.',
        'Select the applicable GST slab (0%, 5%, 12%, 18%, 28%) or type a custom percentage.',
        'Instantly copy the complete invoice tax breakup with CGST and SGST splits for your records.'
      ]
    },
    'salary-calculator': {
      formula: 'In-Hand Pay = Gross CTC - (Employee PF + Professional Tax + Income Tax TDS)',
      explanation: 'Cost to Company (CTC) includes direct earnings, allowances, employer contributions, and statutory withholdings. In India, employees are typically subject to Employee Provident Fund (12% of basic), state Professional Tax (standard ₹200/mo), and Income Tax under either the New Regime (Section 115BAC) or Old Regime.',
      steps: [
        'Select your applicable Financial Year and preferred Tax Regime (New Regime is the default).',
        'Enter your annual CTC as specified in your job offer or appointment letter.',
        'Optionally expand the customization drawer to enter your exact Basic Pay or local Professional Tax amount.',
        'Inspect your estimated monthly take-home salary and the itemized statutory deduction breakup.'
      ]
    },
    'fd-calculator': {
      formula: 'A = P × (1 + r/n)ⁿᵗ',
      explanation: 'Where A is the final maturity amount, P is the deposit principal, r is the annual interest rate, n is the compounding frequency per year (Quarterly = 4 for most Indian banks), and t is the tenure in years. Compound interest accelerates interest earnings over extended tenures.',
      steps: [
        'Enter the lump-sum principal amount you wish to deposit in a bank or post office fixed deposit.',
        'Specify the annual interest rate provided by the bank.',
        'Toggle the Senior Citizen bonus (+0.50%) if the deposit is in the name of an individual aged 60+.',
        'Select the compounding interval (Quarterly is standard across SBI, HDFC, ICICI, etc.) and view your maturity value.'
      ]
    },
    'percentage-calculator': {
      formula: 'X% of Y = (X × Y) / 100 | Percentage = (Part / Total) × 100% | Change = ((New - Old) / |Old|) × 100%',
      explanation: 'Percentages express quantities as fractions of 100. This multi-mode engine solves direct percentages, proportion percentages (such as exam marks obtained out of maximum marks), and percentage increments or reductions.',
      steps: [
        'Select the calculation mode that matches your math problem.',
        'Enter the numerical values into the input fields.',
        'View the final computed result with the exact mathematical formula.',
        'Explore the practical example cards below to learn common school and commerce scenarios.'
      ]
    },
    'cgpa-calculator': {
      formula: 'Weighted CGPA = Σ(Grade Point × Credit) / Σ(Credit) | Estimated % = CGPA × Factor',
      explanation: 'In credit-based grading systems (CBCS), Cumulative Grade Point Average is calculated by weighting each subject grade point by its allotted credits. Percentage conversion rules differ by board and university; CBSE and AICTE benchmark is 9.5, while autonomous universities may use custom factors.',
      steps: [
        'Choose whether to calculate weighted CGPA with credits or simple unweighted average.',
        'Add your subjects or semesters and enter your grade points (0 to 10 scale).',
        'Inspect your calculated CGPA and total semester credits.',
        'Adjust the conversion factor if your institution specifies a multiplier other than 9.5.'
      ]
    },
    'age-calculator': {
      formula: 'Calendar Span = TargetDate - DateOfBirth (Accounting for Leap Years & Variable Months)',
      explanation: 'Calculates chronological age by measuring exact elapsed calendar boundaries (years, months, days) taking leap years and variable month lengths into account, plus total days, weeks, and countdown to your next birthday.',
      steps: [
        'Select your Date of Birth using the date picker.',
        'Select the target calculation date (defaults to today).',
        'Inspect your exact age breakdown in years, months, and days.',
        'View the days countdown to your next upcoming birthday.'
      ]
    },
    'study-timer': {
      formula: 'Interval Cadence: Focus (25m / Custom) → Short Break (5m) → Long Break (15m)',
      explanation: 'Based on the scientifically validated Pomodoro technique, structured intervals prevent mental fatigue, improve deep focus, and maintain sustained concentration during competitive exam preparation.',
      steps: [
        'Choose your desired study mode (Pomodoro, Short Break, Long Break, or Custom).',
        'Click Start to begin the countdown timer.',
        'Work with full focus until the audio chime notifies you that the session has concluded.',
        'Take a restorative break to allow your brain to synthesize information.'
      ]
    },
    'word-counter': {
      formula: 'Words = Count(Non-Whitespace Tokens) | Reading Time = Words / 200 WPM',
      explanation: 'Analyzes text length, character counts with and without spaces, sentences, paragraphs, and estimated speech and reading durations calibrated for Indian university essays, competitive exams, and assignments.',
      steps: [
        'Type or paste your text into the input area.',
        'View real-time metric cards updating dynamically as you write.',
        'Check estimated reading and speaking durations.',
        'Use the one-click copy or clear buttons to manage your text content.'
      ]
    },
    'jpg-to-pdf': {
      formula: 'Image Stream → Binary PDF Canvas Packaging (A4 / Original Aspect Ratio)',
      explanation: 'Extracts raster pixel streams from uploaded images (JPEG, PNG, WEBP) and packages them into clean binary PDF page streams via pdf-lib in client memory.',
      steps: [
        'Upload one or more JPG, PNG, or WEBP images.',
        'Choose page orientation (Portrait or Landscape) and margin styling.',
        'Click Generate PDF to assemble your document.',
        'Download your compiled PDF file instantly.'
      ]
    },
    'pdf-to-jpg': {
      formula: 'PDF Vector Page → Canvas Render Rasterization (300 DPI / High Quality JPEG)',
      explanation: 'Renders vector and text PDF pages onto an HTML5 Canvas at crisp resolutions and exports individual high-quality JPEG images.',
      steps: [
        'Select a PDF document from your device.',
        'Choose the output image quality (High, Medium, Web).',
        'Convert all pages or extract specific individual pages.',
        'Download your converted image files directly.'
      ]
    },
    'pdf-compressor': {
      formula: 'Object Stream Deflation + Font/Image Stream Re-encoding',
      explanation: 'Optimizes internal PDF object dictionaries, eliminates redundant metadata streams, and re-compresses document byte structures in client memory.',
      steps: [
        'Upload the PDF file you need to compress.',
        'Select the compression level (Balanced, High, Maximum).',
        'Review the estimated output size against portal limits.',
        'Download your compressed PDF file.'
      ]
    },
    'image-compressor': {
      formula: 'Canvas Lossy Quality Scaling + Pixel Resampling Iteration',
      explanation: 'Adjusts JPEG/WEBP quantization tables and compresses bitmap raster buffers to achieve targeted file size ceilings without perceptible quality loss.',
      steps: [
        'Upload your photograph, signature, or certificate image.',
        'Select a portal target preset (<20 KB Signature, <50 KB Photo) or custom slider.',
        'Inspect the instant preview and reduction percentage.',
        'Download your compressed image file.'
      ]
    },
    'image-resizer': {
      formula: 'Bilinear Pixel Interpolation + Dimension Aspect Ratio Preservation',
      explanation: 'Resamples image pixel matrices to exact pixel (width × height) or millimeter dimensions matching recruitment application guidelines (UPSC 350×350, SSC 200×230).',
      steps: [
        'Upload the photo or identity document you wish to resize.',
        'Select a standard Indian recruitment portal preset or enter custom pixel dimensions.',
        'Keep the aspect ratio locked to prevent distorted proportions.',
        'Download your resized image file.'
      ]
    },
    'qr-generator': {
      formula: 'Reed-Solomon Error Correction (L/M/Q/H) + 2D Matrix Byte Encoding',
      explanation: 'Encodes text, URLs, UPI payment identifiers, or Wi-Fi configurations into an ISO/IEC 18004 QR code matrix with customizable error correction.',
      steps: [
        'Select the QR type (URL, UPI Payment, Wi-Fi, Plain Text, Contact).',
        'Fill in the relevant details (e.g. UPI VPA, payee name, Wi-Fi SSID).',
        'Customize color styling and error correction level.',
        'Download your high-resolution PNG or vector SVG QR code.'
      ]
    },
    'password-generator': {
      formula: 'Web Crypto API CSRNG + Shannon Entropy Bit Calculation (E = L × log₂(N))',
      explanation: 'Uses cryptographically secure random byte generators (window.crypto.getRandomValues) with unbiased rejection sampling to guarantee uniform entropy without modulo bias.',
      steps: [
        'Choose your desired password length (default 16 characters).',
        'Select character pools (Uppercase, Lowercase, Numbers, Symbols).',
        'Inspect the live Shannon entropy bit score and strength estimate.',
        'Click Copy Password to store safely in your clipboard.'
      ]
    },
    'unit-converter': {
      formula: 'Target Value = (Input Value × Source Base Multiplier) / Target Base Multiplier',
      explanation: 'Standardizes conversions across 7 measurement categories (Length, Weight, Temperature, Area, Volume, Time, Speed) and includes traditional Indian land units (Gaj, Bigha, Guntha, Ground).',
      steps: [
        'Select the measurement category from the category selector.',
        'Enter the source quantity and pick your source unit.',
        'Select the target unit to view the real-time converted equivalent.',
        'Inspect the conversion formula and reciprocal multiplier.'
      ]
    },
    'date-difference': {
      formula: 'Total Days = EndDate - StartDate | Chronological Span = Years + Months + Days',
      explanation: 'Calendar-aware Gregorian date math that measures exact day spans, leap-year cycles, total elapsed weeks, and Monday-to-Friday working business days.',
      steps: [
        'Select the start date and end date.',
        'Toggle between inclusive and exclusive day counting modes.',
        'View the full elapsed calendar breakdown in years, months, and days.',
        'Inspect working business days vs. weekend counts.'
      ]
    },
    'bmi-calculator': {
      formula: 'BMI = Weight (kg) / [Height (m)]² | Imperial: 703 × Weight (lbs) / [Height (in)]²',
      explanation: 'Measures body mass index using standard World Health Organization criteria alongside Asian-Indian consensus thresholds (Overweight ≥23, Obese ≥25) reflecting lower body fat cut-offs.',
      steps: [
        'Select your preferred measurement unit (Metric cm/kg or Imperial ft-in/lbs).',
        'Enter your height and weight into the input fields.',
        'View your calculated BMI score, health category, and healthy weight range.',
        'Compare against WHO standard and Asian-Indian guidance.'
      ]
    }
  };

  const formulaInfo = toolFormulas[tool.slug];

  return (
    <PageContainer>
      {/* Navigation Top Bar: Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Breadcrumb
          items={[
            { label: 'Tools', href: '/tools' },
            { label: category ? category.name : tool.category, href: category ? category.route : '/tools' },
            { label: tool.name, href: tool.route }
          ]}
          className="mb-0"
        />
        <BackButton fallbackUrl="/tools" label="Back to Tools" />
      </div>

      <div className="space-y-8">
        
        {/* Tool Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <IconResolver name={tool.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                  <Link
                    to={category?.route || '/tools'}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {category?.name || tool.category}
                  </Link>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className={isImplementedTool ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500'}>
                    {isImplementedTool ? 'Interactive Utility (Ready)' : 'Planned Specification'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {tool.name}
                </h1>

                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 shrink-0 self-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (tool) {
                    const nowFav = toggleFavorite(tool.id);
                    showToast(nowFav ? 'Added to favorites!' : 'Removed from favorites', 'info');
                  }
                }}
                icon={<Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />}
              >
                {isFav ? 'Favorited' : 'Favorite'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                icon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share Tool
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Calculator & Document Workspaces with Inline Error Boundary */}
        <ErrorBoundary inline>
          {/* Finance Tools (Part 6) */}
          {tool.slug === 'emi-calculator' && <EmiCalculatorComponent />}
          {tool.slug === 'sip-calculator' && <SipCalculatorComponent />}
          {tool.slug === 'gst-calculator' && <GstCalculatorComponent />}
          {tool.slug === 'salary-calculator' && <SalaryCalculatorComponent />}
          {tool.slug === 'fd-calculator' && <FdCalculatorComponent />}

          {/* Student Tools (Part 7) */}
          {tool.slug === 'percentage-calculator' && <PercentageCalculatorComponent />}
          {tool.slug === 'cgpa-calculator' && <CgpaCalculatorComponent />}
          {tool.slug === 'age-calculator' && <AgeCalculatorComponent />}
          {tool.slug === 'study-timer' && <StudyTimerComponent />}
          {tool.slug === 'word-counter' && <WordCounterComponent />}

          {/* Document Tools (Part 8) */}
          {tool.slug === 'jpg-to-pdf' && <JpgToPdfComponent />}
          {tool.slug === 'pdf-to-jpg' && <PdfToJpgComponent />}
          {tool.slug === 'pdf-compressor' && <PdfCompressorComponent />}
          {tool.slug === 'image-compressor' && <ImageCompressorComponent />}
          {tool.slug === 'image-resizer' && <ImageResizerComponent />}

          {/* Everyday Tools (Part 9) */}
          {tool.slug === 'qr-generator' && <QrGeneratorComponent />}
          {tool.slug === 'password-generator' && <PasswordGeneratorComponent />}
          {tool.slug === 'unit-converter' && <UnitConverterComponent />}
          {tool.slug === 'date-difference' && <DateDifferenceComponent />}
          {tool.slug === 'bmi-calculator' && <BmiCalculatorComponent />}
          {tool.slug === 'private-calling' && <PrivateCallingComponent />}
        </ErrorBoundary>

        {/* How It Works & Mathematical Formula (For Implemented Tools) */}
        {isImplementedTool && formulaInfo && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-slate-800 dark:text-sky-400" aria-hidden="true" />
                <span>Calculation Formula & How It Works</span>
              </h2>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-slate-900 dark:text-sky-300 font-semibold text-center select-all">
              {formulaInfo.formula}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {formulaInfo.explanation}
            </p>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                How to Use This Tool
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {formulaInfo.steps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Step {idx + 1}</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Architectural Placeholder / Blueprint (Only for tools not yet implemented, excluding private-calling) */}
        {!isImplementedTool && tool.slug !== 'private-calling' && (
          <>
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Architectural Specification Prepared
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    This tool route and data schema are registered in the platform routing tree. The interactive calculation engine is scheduled for an upcoming batch.
                  </p>
                </div>
              </div>

              <Link to="/support/suggest-tool" className="shrink-0">
                <Button variant="secondary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  Suggest Requirement
                </Button>
              </Link>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-6">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-slate-800 dark:text-sky-400" />
                  <span>Planned Engine Capabilities</span>
                </h2>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  {tool.plannedFeatures?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-slate-800 dark:text-sky-400" />
                    <span>Target Users</span>
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.targetAudience?.map((audience, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-slate-800 dark:text-sky-400" />
                    <span>Privacy & Performance Guarantee</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    When activated, this tool will execute entirely in client-side memory using browser native APIs. Zero telemetry or document retention on remote servers.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contextual Legal & Privacy Disclaimer */}
        {isImplementedTool && (
          <div className="p-4 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Privacy & Processing Notice:</strong> All documents, marksheets, photographs, and signatures processed using India Smart Tools are executed entirely in your device's browser memory using HTML5 Canvas and client-side PDF libraries. No uploaded files are transmitted to external servers, cloud databases, or third-party APIs. Compression percentages and resolution adaptations are mathematical estimates based on source file contents.
            </p>
          </div>
        )}

        {/* Genuine Frequently Asked Questions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 transition-colors">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-slate-800 dark:text-sky-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx === 0 ? 'pb-4' : 'py-4'}>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Related {category?.name || 'Tools'}
              </h2>
              <Link
                to={category?.route || '/tools'}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1"
              >
                <span>View all in {category?.name || 'category'}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map(rel => (
                <ToolCard key={rel.id} tool={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-2">
          <Link
            to={category?.route || '/tools'}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {category?.name || 'Tools'}</span>
          </Link>
        </div>

      </div>
    </PageContainer>
  );
};
