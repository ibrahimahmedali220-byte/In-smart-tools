import React, { useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { IconResolver } from '../components/common/IconResolver';
import { ToolCard } from '../components/common/ToolCard';
import { Button } from '../components/common/Button';
import { getToolBySlug, getCategoryById, getToolsByCategory, TOOLS } from '../data/tools';
import { Link } from '../router/Router';
import { updateSeoMetadata, getBreadcrumbListSchema, getWebApplicationSchema } from '../utils/seo';
import { safeClipboardCopy } from '../utils/security';
import { NotFoundPage } from './NotFoundPage';
import { useToast } from '../components/common/Toast';

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

import {
  Layers,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Share2,
  HelpCircle,
  BookOpen,
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
    if (tool) {
      recordToolVisit(tool.id);

      const categoryItem = getCategoryById(tool.category);
      const breadcrumbs = [
        { name: 'Home', item: '/' },
        { name: 'Tools', item: '/tools' },
        { name: categoryItem ? categoryItem.name : tool.category, item: categoryItem ? categoryItem.route : '/tools' },
        { name: tool.name, item: tool.route }
      ];

      const jsonLd = [
        getBreadcrumbListSchema(breadcrumbs),
        getWebApplicationSchema(tool.name, tool.description, tool.category, tool.route)
      ];

      updateSeoMetadata({
        title: tool.seoTitle || `${tool.name} – Free Online Tool`,
        description: tool.seoDescription || tool.description,
        canonicalPath: tool.route,
        jsonLd
      });
    }
  }, [tool, recordToolVisit]);

  if (!tool) {
    return <NotFoundPage />;
  }

  const category = getCategoryById(tool.category);

  // Compute related tools: use specified relations for implemented tools, or category fallback
  const relatedSlugs = SPECIFIED_RELATED_TOOLS[tool.slug];
  const relatedTools = relatedSlugs
    ? TOOLS.filter(t => relatedSlugs.includes(t.slug))
    : getToolsByCategory(tool.category).filter(t => t.id !== tool.id).slice(0, 3);

  const handleShare = async () => {
    const success = await safeClipboardCopy(window.location.href);
    if (success) {
      showToast('Tool link copied to clipboard!', 'success');
    } else {
      showToast('Please copy the URL from your browser address bar.', 'info');
    }
  };

  const isImplementedTool = [
    // Finance (Part 6)
    'emi-calculator',
    'sip-calculator',
    'gst-calculator',
    'salary-calculator',
    'fd-calculator',
    // Student (Part 7)
    'percentage-calculator',
    'cgpa-calculator',
    'age-calculator',
    'study-timer',
    'word-counter',
    // Documents (Part 8)
    'jpg-to-pdf',
    'pdf-to-jpg',
    'pdf-compressor',
    'image-compressor',
    'image-resizer',
    // Everyday (Part 9)
    'qr-generator',
    'password-generator',
    'unit-converter',
    'date-difference',
    'bmi-calculator'
  ].includes(tool.slug);

  // Curated genuine FAQs per category
  const categoryFaqs: Record<string, { q: string; a: string }[]> = {
    finance: [
      {
        q: 'Are these calculations tuned to Indian banking guidelines?',
        a: 'Yes. Calculations use RBI standard reducing balance formulas, quarterly compounding rules, and CBDT tax regime guidelines.'
      },
      {
        q: 'Is my financial data uploaded to any remote server?',
        a: 'No. Computations run 100% locally on your device using client-side JavaScript. We never store or transmit your salary, loan, or investment data.'
      },
      {
        q: 'Can I use these figures for formal loan applications or tax filing?',
        a: 'Our tools provide precise educational approximations. Always verify critical binding figures with your bank, lender, or Chartered Accountant.'
      }
    ],
    student: [
      {
        q: 'Does the CGPA calculator support university-specific conversion multipliers?',
        a: 'Yes. In addition to the default 9.5 multiplier recommended by CBSE and AICTE, you can configure any multiplier required by autonomous universities.'
      },
      {
        q: 'Does the Age Calculator account for leap years and recruitment cutoff dates?',
        a: 'Yes. The calculation uses calendar-aware date arithmetic, perfectly handling February leap years and official UPSC, SSC, and State PSC cutoffs.'
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
      formula: 'Calendar Difference: Target Date (Year, Month, Day) - Birth Date (Year, Month, Day)',
      explanation: 'Unlike simplistic estimates that assume all years have 365 days, this calendar-aware algorithm handles leap years, month length variations (28, 29, 30, 31 days), and precise day-borrowing mathematics. Ideal for verifying Sarkari job cutoff eligibility.',
      steps: [
        'Enter your Date of Birth as recorded in your 10th standard certificate or birth registry.',
        'Choose the target calculation date (defaults to today, or select an official exam cutoff date).',
        'Optionally click a popular exam cutoff preset (e.g. 1st August for UPSC/SSC).',
        'Review your exact age in years, months, and days, along with the countdown to your next birthday.'
      ]
    },
    'study-timer': {
      formula: 'Pomodoro Interval Cycle: 25 min Focus + 5 min Short Break (Long Break every 4 sessions)',
      explanation: 'The Pomodoro Technique breaks academic revision into focused intervals separated by short pauses. This study timer uses time-based monotonic clock synchronization, so it stays mathematically accurate even when the browser tab is minimized or backgrounded.',
      steps: [
        'Select your session mode: Focus (25m), Short Break (5m), or Long Break (15m).',
        'Click Start to begin your revision sprint.',
        'A gentle synthesized dual-tone chime will notify you when your focus block completes.',
        'Take a restorative breather before starting your next study block.'
      ]
    },
    'word-counter': {
      formula: 'Words: Unicode Word Boundaries | Reading Time: Math.ceil(Words / 200) Minutes',
      explanation: 'This Unicode-aware text analysis engine inspects prose across English and Indian regional scripts (Hindi, Bengali, Assamese, Tamil, etc.). It counts words, characters with and without whitespace, sentences, and paragraphs, and estimates silent reading and speaking durations.',
      steps: [
        'Type or paste your text, essay, Statement of Purpose (SOP), or answer into the editor.',
        'Watch metrics update in real time without clicking any buttons.',
        'Verify your word count against Common App, college admission, or exam word ceilings.',
        'Use the Copy button to copy your formatted text to your clipboard.'
      ]
    },
    'jpg-to-pdf': {
      formula: 'PDF Document Compilation: Binary Object Stream Packing via pdf-lib',
      explanation: 'Combines individual bitmap images (JPEG, PNG, WebP) into an ISO 32000-1 compliant PDF container. Scales raster dimensions to printable paper boundaries (A4, Letter, or natural dimensions) without quality loss or server uploads.',
      steps: [
        'Click Browse or drag and drop your photos, certificates, or marksheets.',
        'Reorder images using the Up/Down arrows to set page sequence.',
        'Choose page orientation (Portrait, Landscape, or Auto) and page size (A4 or Letter).',
        'Click "Convert to PDF" and download your compiled PDF document.'
      ]
    },
    'pdf-to-jpg': {
      formula: 'Rasterization Pipeline: PDF Page Rendering via HTML5 Canvas (150-300 DPI)',
      explanation: 'Parses PDF vector content, text paths, and embedded raster images, rendering each page onto an isolated HTML5 canvas context. Script execution is strictly disabled (isEvalSupported: false) to prevent malicious PDF script payloads.',
      steps: [
        'Upload your PDF document.',
        'Review the page count and choose the page range to extract.',
        'Select image quality (Standard 1.5x or High Quality 2.0x).',
        'Download individual high-resolution JPG images of each page.'
      ]
    },
    'pdf-compressor': {
      formula: 'Stream Compression: Object Stream Packing, Deduplication & Metadata Stripping',
      explanation: 'Optimizes cross-reference tables (xref), merges duplicate resource streams, and strips redundant PDF metadata. Compression results vary based on PDF composition (uncompressed scanned image PDFs yield dramatic reductions).',
      steps: [
        'Upload the PDF file you wish to compress.',
        'Select compression strength: Standard, Balanced, or Aggressive.',
        'Inspect the before-and-after file size and percentage reduction.',
        'Download your optimized PDF ready for government portal uploads.'
      ]
    },
    'image-compressor': {
      formula: 'Lossy DCT & WebP Quantization: HTML5 Canvas toBlob Quality Reduction',
      explanation: 'Applies discrete cosine transform (DCT) quantization for JPEGs and predictive block compression for WebP images. Calibrated to target official Indian government portal size ceilings (<20 KB for signatures, <50 KB for photos).',
      steps: [
        'Upload your passport photograph, signature, or certificate image.',
        'Select a one-click Sarkari portal preset (<20 KB, <50 KB) or adjust the quality slider.',
        'Compare original and compressed sizes side by side.',
        'Download your compressed image with guaranteed portal compatibility.'
      ]
    },
    'image-resizer': {
      formula: 'Bicubic Image Resampling: Canvas 2D Bilinear Resizing with Aspect Lock',
      explanation: 'Resamples image pixel matrices to exact pixel dimensions (such as UPSC 350x350 px or SSC 200x230 px). The aspect ratio lock prevents portrait distortion while allowing custom pixel scaling.',
      steps: [
        'Upload the photo or signature to resize.',
        'Click an official portal dimension preset or enter target width and height in pixels.',
        'Toggle aspect ratio lock to preserve natural proportions.',
        'Click "Resize Image" and download the resized file.'
      ]
    },
    'qr-generator': {
      formula: 'ISO/IEC 18004 2D Barcode Matrix with Reed-Solomon Error Correction',
      explanation: 'Encodes character data into 2D black-and-white square modules with position detection patterns, timing tracks, and configurable error correction (Level L: 7%, M: 15%, Q: 25%, H: 30%). Runs completely in-browser without sending your URLs, texts, or passwords over the network.',
      steps: [
        'Select the data type you want to encode: Website URL, Plain Text, Wi-Fi Network, Email, or Telephone.',
        'Enter or paste your destination data in the designated input field.',
        'Optionally tune export resolution (200px to 800px), margin width, and Reed-Solomon error correction level.',
        'Click "Download PNG Image" for general digital sharing or "Download Vector SVG" for infinite-scale print jobs.'
      ]
    },
    'password-generator': {
      formula: 'CSPRNG Information Entropy: E = L × log₂(N) bits (Web Crypto API)',
      explanation: 'Where L is the password length and N is the character pool size. Uses window.crypto.getRandomValues with unbiased rejection sampling to guarantee uniform entropy without predictable pseudo-random seeds or Math.random vulnerabilities.',
      steps: [
        'Choose your desired password length using the slider or numeric input box.',
        'Toggle your required character sets: Uppercase, Lowercase, Digits, and Special Symbols.',
        'Optionally enable "Exclude Ambiguous Characters" to remove confusing lookalike glyphs (1, l, I, 0, O).',
        'Review the calculated Shannon entropy score and estimated brute-force crack time.',
        'Click "Copy Password to Clipboard" to transfer the secure key directly into your password manager.'
      ]
    },
    'unit-converter': {
      formula: 'Dimensional Base-Unit Transformation: Target = fromBase( toBase(Value) )',
      explanation: 'Converts linear quantities through unified SI base standards (Meters, Kilograms, Seconds, Square Meters, Liters) and applies non-linear thermodynamic formulas for Fahrenheit, Celsius, and Kelvin. Includes calibrated traditional Indian land measures (Gaj, Bigha, Guntha, Ground, Marla, Kanal).',
      steps: [
        'Select your measurement category: Length, Weight, Temperature, Area & Land, Volume, Time, or Speed.',
        'Choose the origin "From" unit and destination "To" unit from the responsive dropdowns.',
        'Type any positive, negative, or decimal value in the input field.',
        'Use the two-way Swap button to instantly flip the conversion direction.',
        'Copy the result or refer to the exact mathematical conversion formula displayed below.'
      ]
    },
    'date-difference': {
      formula: 'Calendar Chronological Span: ΔY Years, ΔM Months, ΔD Days + Aggregate Days',
      explanation: 'Performs calendar-aware Gregorian date subtraction handling variable 28/29/30/31 day month boundaries and leap years, alongside total elapsed days and Monday-through-Friday working business days.',
      steps: [
        'Select the Start Date and End Date from the calendar pickers.',
        'Choose your calculation method: Exclusive (standard interval) or Inclusive (counting both endpoints).',
        'Inspect the exact calendar breakdown in years, months, and days.',
        'Review aggregate metrics including total elapsed days, continuous hours, and official working business days.'
      ]
    },
    'bmi-calculator': {
      formula: 'Body Mass Index: BMI = weight (kg) / [height (m)]²',
      explanation: 'Evaluates adult body mass index according to both International WHO reference thresholds (<18.5 Underweight, 18.5–24.9 Normal, 25–29.9 Overweight, ≥30 Obese) and Asian-Indian consensus guidelines (Overweight at ≥23, Obese at ≥25).',
      steps: [
        'Select your preferred measurement standard: Metric (cm, kg) or Imperial (feet/inches, pounds).',
        'Enter your height and body weight using the input fields or interactive sliders.',
        'View your calculated BMI score along with simultaneous WHO and Asian-Indian health category classifications.',
        'Review the optimal healthy weight range calibrated specifically for your stature.'
      ]
    }
  };

  const formulaInfo = toolFormulas[tool.slug];

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', href: '/tools' },
          { label: category ? category.name : tool.category, href: category ? category.route : '/tools' },
          { label: tool.name, href: tool.route }
        ]}
        className="mb-6"
      />

      <div className="space-y-8">
        
        {/* Tool Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                <IconResolver name={tool.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                  <Link
                    to={category?.route || '/tools'}
                    className="text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    {category?.name || tool.category}
                  </Link>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className={isImplementedTool ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                    {isImplementedTool ? 'Interactive Utility (Ready)' : 'Planned Specification'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {tool.name}
                </h1>

                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
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

        {/* Interactive Calculator & Document Workspaces */}
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

        {/* How It Works & Mathematical Formula (For Implemented Tools) */}
        {isImplementedTool && formulaInfo && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-slate-800" aria-hidden="true" />
                <span>Calculation Formula & How It Works</span>
              </h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-900 font-semibold text-center select-all">
              {formulaInfo.formula}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {formulaInfo.explanation}
            </p>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                How to Use This Tool
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {formulaInfo.steps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-xs font-bold text-slate-900">Step {idx + 1}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Architectural Placeholder / Blueprint (Only for tools not yet implemented) */}
        {!isImplementedTool && (
          <>
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200/80 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Architectural Specification Prepared
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
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
              <div className="bg-white rounded-xl border border-slate-200/90 p-6">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-slate-800" />
                  <span>Planned Engine Capabilities</span>
                </h2>
                <ul className="space-y-3 text-xs text-slate-600">
                  {tool.plannedFeatures?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-slate-800" />
                    <span>Target Users</span>
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.targetAudience?.map((audience, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-slate-800" />
                    <span>Privacy & Performance Guarantee</span>
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When activated, this tool will execute entirely in client-side memory using browser native APIs. Zero telemetry or document retention on remote servers.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contextual Legal & Privacy Disclaimer */}
        {isImplementedTool && (
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Privacy & Processing Notice:</strong> All documents, marksheets, photographs, and signatures processed using India Smart Tools are executed entirely in your device's browser memory using HTML5 Canvas and client-side PDF libraries. No uploaded files are transmitted to external servers, cloud databases, or third-party APIs. Compression percentages and resolution adaptations are mathematical estimates based on source file contents.
            </p>
          </div>
        )}

        {/* Genuine Frequently Asked Questions */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-slate-800" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx === 0 ? 'pb-4' : 'py-4'}>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
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
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Related {category?.name || 'Tools'}
              </h2>
              <Link
                to={category?.route || '/tools'}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1"
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {category?.name || 'Tools'}</span>
          </Link>
        </div>

      </div>
    </PageContainer>
  );
};
