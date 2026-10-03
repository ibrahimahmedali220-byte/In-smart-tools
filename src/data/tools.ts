import { ToolCategory, ToolItem, CategoryItem } from '../types/tool';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'finance',
    name: 'Finance Tools',
    slug: 'finance',
    tagline: 'Smart money calculators for Indian households and professionals',
    description: 'Accurate interest, loan, investment, and tax utilities tuned to Indian financial standards and schemes.',
    icon: 'Landmark',
    route: '/tools/finance'
  },
  {
    id: 'student',
    name: 'Student Tools',
    slug: 'student',
    tagline: 'Academic aids for schools, colleges, and competitive exams',
    description: 'Fast grade converters, study focus timers, age checkers, and text analysis tools for Indian learners.',
    icon: 'GraduationCap',
    route: '/tools/student'
  },
  {
    id: 'documents',
    name: 'Document Tools',
    slug: 'documents',
    tagline: 'Privacy-focused file compressors and format converters',
    description: 'Client-first PDF and image processing built for job applications, government portals, and exam submissions.',
    icon: 'FileText',
    route: '/tools/documents'
  },
  {
    id: 'everyday',
    name: 'Everyday Tools',
    slug: 'everyday',
    tagline: 'Practical utilities for daily digital productivity',
    description: 'Instant QR generation, secure passwords, date math, metric conversions, and health metrics.',
    icon: 'Sparkles',
    route: '/tools/everyday'
  }
];

export const TOOLS: ToolItem[] = [
  // 1. Finance Tools
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    category: 'finance',
    description: 'Calculate monthly loan installments, total interest, and amortization schedule for home, car, or personal loans.',
    icon: 'Calculator',
    keywords: ['emi', 'loan', 'home loan', 'car loan', 'personal loan', 'interest', 'bank', 'sbi', 'hdfc', 'amortization', 'repayment'],
    status: 'implemented',
    route: '/tools/emi-calculator',
    summary: 'Standard reducing balance EMI & amortization breakdown',
    targetAudience: ['Home buyers', 'Car loan seekers', 'Personal budgeters'],
    plannedFeatures: [
      'Standard Indian reducing balance formula (P x R x (1+R)^N / ((1+R)^N - 1))',
      'Pre-payment impact and tenure reduction modeling',
      'Year-by-year and month-by-month principal vs interest schedule',
      'Instant shareable loan summary PDF export'
    ],
    seoTitle: 'EMI Calculator – Home, Car & Personal Loan EMI | India Smart Tools',
    seoDescription: 'Free online EMI Calculator for Indian bank loans. Calculate loan EMIs, interest payable, and monthly payment schedules.'
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    category: 'finance',
    description: 'Forecast the wealth growth of Systematic Investment Plans in mutual funds over time with compounding calculations.',
    icon: 'TrendingUp',
    keywords: ['sip', 'mutual fund', 'investment', 'compounding', 'wealth', 'nav', 'returns', 'finance', 'cagr'],
    status: 'implemented',
    route: '/tools/sip-calculator',
    summary: 'Monthly compounding growth projection for mutual funds',
    targetAudience: ['Mutual fund investors', 'Salaried professionals', 'Retirement planners'],
    plannedFeatures: [
      'Monthly SIP and one-time lump-sum compounding modes',
      'Step-up annual SIP increment calculation (5%, 10%, 15%)',
      'Visual breakdown of invested principal vs expected returns',
      'Inflation-adjusted purchasing power estimate'
    ],
    seoTitle: 'SIP Calculator – Mutual Fund Returns & Growth Projection | India Smart Tools',
    seoDescription: 'Calculate expected returns on mutual fund SIP investments in India with step-up increments and inflation adjustments.'
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    category: 'finance',
    description: 'Compute inclusive and exclusive Goods and Services Tax for all Indian standard GST slabs (5%, 12%, 18%, 28%).',
    icon: 'Receipt',
    keywords: ['gst', 'tax', 'cgst', 'sgst', 'igst', 'invoice', 'hsn', 'slab', 'business', 'billing'],
    status: 'implemented',
    route: '/tools/gst-calculator',
    summary: 'Instant GST addition or removal with CGST/SGST/IGST splits',
    targetAudience: ['Shopkeepers', 'Freelancers', 'Chartered Accountants', 'Small Business Owners'],
    plannedFeatures: [
      'Dual modes: Add GST (exclusive) & Remove GST (inclusive)',
      'Pre-configured standard slabs: 0%, 5%, 12%, 18%, 28% plus custom rates',
      'Intra-state (CGST + SGST) vs Inter-state (IGST) division breakdown',
      'Copyable tax breakup for invoicing and quotation preparation'
    ],
    seoTitle: 'GST Calculator – Inclusive & Exclusive GST Rates | India Smart Tools',
    seoDescription: 'Fast, free GST calculator for Indian businesses and freelancers. Calculate 5%, 12%, 18%, and 28% GST with CGST/SGST split.'
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    category: 'finance',
    description: 'Convert annual Cost to Company (CTC) into realistic in-hand monthly take-home pay under old and new Indian tax regimes.',
    icon: 'BadgeIndianRupee',
    keywords: ['salary', 'ctc', 'take home', 'in hand', 'income tax', 'epf', 'pf', 'professional tax', 'tds', 'form 16'],
    status: 'implemented',
    route: '/tools/salary-calculator',
    summary: 'CTC to monthly in-hand wage estimator with tax regime comparison',
    targetAudience: ['Job offer evaluators', 'Salaried employees', 'HR teams'],
    plannedFeatures: [
      'New vs Old tax regime comparison for FY 2025-26 / 2026-27',
      'Standard deduction, EPF (12%), and state Professional Tax deduction deduction',
      'HRA, NPS, and standard allowance breakdown',
      'Side-by-side net pay difference preview'
    ],
    seoTitle: 'In-Hand Salary Calculator (CTC to Monthly Pay) | India Smart Tools',
    seoDescription: 'Calculate monthly take-home salary from total CTC in India. Detailed deductions for PF, PT, and income tax regimes.'
  },
  {
    id: 'fd-calculator',
    name: 'FD Calculator',
    slug: 'fd-calculator',
    category: 'finance',
    description: 'Compute maturity amounts and interest earnings on fixed deposits across major Indian public and private sector banks.',
    icon: 'PiggyBank',
    keywords: ['fd', 'fixed deposit', 'term deposit', 'interest', 'maturity', 'senior citizen', 'post office', 'bank fd'],
    status: 'implemented',
    route: '/tools/fd-calculator',
    summary: 'Quarterly compounding fixed deposit maturity estimator',
    targetAudience: ['Senior citizens', 'Conservative savers', 'Post office depositors'],
    plannedFeatures: [
      'Standard compounding cycles: Quarterly, Monthly, Half-yearly, Cumulative',
      'Senior citizen preferential interest rate toggle (+0.50% / +0.75%)',
      'TDS threshold applicability indicators',
      'Comparison table of interest earned across tenure intervals'
    ],
    seoTitle: 'FD Calculator – Fixed Deposit Maturity & Interest | India Smart Tools',
    seoDescription: 'Calculate Fixed Deposit maturity value and interest earnings across Indian banks with quarterly compounding and senior citizen rates.'
  },

  // 2. Student Tools
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'student',
    description: 'Solve board exam marks percentages, percentage increase or decrease, and marks needed to hit target percentage goals.',
    icon: 'Percent',
    keywords: ['percentage', 'percent', 'marks', 'exam', 'cbse', 'icse', 'state board', 'ratio', 'score'],
    status: 'implemented',
    route: '/tools/percentage-calculator',
    summary: 'Multi-mode academic and general percentage solver',
    targetAudience: ['School students', 'College aspirants', 'Competitive examinees'],
    plannedFeatures: [
      'Exam marks percentage: Total marks obtained vs maximum marks',
      'Subject-wise marks aggregate calculator with grade threshold preview',
      'Percentage increase/decrease and difference calculators',
      'Reverse calculator: Find required marks in remaining paper to achieve target'
    ],
    seoTitle: 'Percentage Calculator — Calculate Percentages Easily | India Smart Tools',
    seoDescription: 'Calculate exam percentages, marks increments, and grade requirements for CBSE, ICSE, and state board exams.'
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    slug: 'cgpa-calculator',
    category: 'student',
    description: 'Convert university CGPA / SGPA to percentage using standard Indian university formulas (CBSE 9.5x, VTU, Mumbai Univ, AKTU).',
    icon: 'Award',
    keywords: ['cgpa', 'sgpa', 'percentage', 'grade', 'gpa', 'university', 'vtu', 'aktu', 'cbse', 'engineering', 'college'],
    status: 'implemented',
    route: '/tools/cgpa-calculator',
    summary: 'Standard Indian university CGPA-to-Percentage converter',
    targetAudience: ['College students', 'Job applicants filling government forms', 'Campus recruits'],
    plannedFeatures: [
      'Preset formula presets: CBSE (x 9.5), VTU (CGPA - 0.75) x 10, Mumbai Univ, AKTU, and custom (x - y) * z',
      'Semester-wise SGPA weighted credit points calculator',
      'Official conversion certificate format copy text for job forms',
      'Direct output formatted for TCS, Infosys, and UPSC portal requirements'
    ],
    seoTitle: 'CGPA Calculator — Calculate CGPA Easily | India Smart Tools',
    seoDescription: 'Convert CGPA and SGPA to percentage according to CBSE 9.5 multiplier, VTU, AKTU, and state university conversion formulas.'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'student',
    description: 'Determine exact age in years, months, and days for government recruitment forms (UPSC, SSC, Banking, Railways) as of cutoff dates.',
    icon: 'Calendar',
    keywords: ['age', 'dob', 'date of birth', 'upsc', 'ssc', 'railways', 'government job', 'cutoff date', 'eligibility'],
    status: 'implemented',
    route: '/tools/age-calculator',
    summary: 'Exact chronological age calculator with exam cutoff verification',
    targetAudience: ['Sarkari job aspirants', 'College admissions applicants', 'Passport applicants'],
    plannedFeatures: [
      'Exact age breakdown: Years, months, weeks, days, hours, and minutes',
      'Cutoff date eligibility calculator (e.g., "Age as on 1st August 2026")',
      'Countdown to next upcoming birthday',
      'Leap year aware precise day counter'
    ],
    seoTitle: 'Age Calculator — Calculate Your Exact Age | India Smart Tools',
    seoDescription: 'Free online Age Calculator to check exact age as on exam cutoff dates for UPSC, SSC, IBPS, and state government applications.'
  },
  {
    id: 'study-timer',
    name: 'Study Timer',
    slug: 'study-timer',
    category: 'student',
    description: 'Distraction-free Pomodoro and custom interval timer configured for intense revision sprints and deep exam prep sessions.',
    icon: 'Timer',
    keywords: ['study timer', 'pomodoro', 'focus', 'stopwatch', 'revision', 'exam prep', 'productivity', 'interval'],
    status: 'implemented',
    route: '/tools/study-timer',
    summary: 'Focused 25/5 study interval timer with ambient tone cues',
    targetAudience: ['Competitive exam aspirants', 'Coders', 'Remote students'],
    plannedFeatures: [
      'Classic Pomodoro (25 min focus / 5 min short break / 15 min long break)',
      'Custom interval presets for 50/10 and 90-minute deep work cycles',
      'Subtle browser notification bells and visual completion states',
      'Session streak counter stored locally without account requirements'
    ],
    seoTitle: 'Study Timer — Free Online Study Timer | India Smart Tools',
    seoDescription: 'Distraction-free online study timer with custom intervals and breaks designed for Indian competitive exam aspirants.'
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    category: 'student',
    description: 'Real-time word, character, sentence, paragraph, and reading-time counter for college essays, SOPs, and exam answers.',
    icon: 'AlignLeft',
    keywords: ['word counter', 'character count', 'essay', 'sop', 'writing', 'reading time', 'paragraphs', 'text analysis'],
    status: 'implemented',
    route: '/tools/word-counter',
    summary: 'Instant text metrics and statement-of-purpose length validator',
    targetAudience: ['Study abroad applicants (SOP/LOR)', 'Content writers', 'Civil service essay writers'],
    plannedFeatures: [
      'Instant character count with and without spaces',
      'Word count, sentence count, paragraph count, and average word length',
      'Estimated reading time (200 wpm) and speaking time (130 wpm)',
      'Character limit warnings for Common App, SOPs, and Twitter/LinkedIn'
    ],
    seoTitle: 'Word Counter — Count Words & Characters | India Smart Tools',
    seoDescription: 'Count words, characters, sentences, and reading time instantly. Ideal for academic essays, SOPs, and competitive exams.'
  },

  // 3. Document Tools
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    category: 'documents',
    description: 'Combine multiple JPG, JPEG, and PNG images into a single clean PDF document securely inside your browser.',
    icon: 'FileImage',
    keywords: ['jpg to pdf', 'image to pdf', 'photo to pdf', 'convert', 'document', 'aadhaar', 'pan card', 'marksheet'],
    status: 'implemented',
    route: '/tools/jpg-to-pdf',
    summary: 'Fast in-browser photo-to-PDF compiler with page reordering',
    targetAudience: ['Job portal applicants', 'Students submitting scanned assignments', 'Office administrators'],
    plannedFeatures: [
      '100% Client-side conversion: Photos never upload to external servers',
      'Drag-and-drop reordering of multiple pages before compilation',
      'Page margin adjustments (None, Small, Standard A4)',
      'Orientation controls: Portrait and Landscape per page'
    ],
    seoTitle: 'JPG to PDF Converter Online | India Smart Tools',
    seoDescription: 'Convert JPG images to PDF documents online for free. 100% private, runs in browser, perfect for marksheets and certificates.'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    category: 'documents',
    description: 'Extract pages from PDF files and save them as high-quality individual JPG or PNG images on any device.',
    icon: 'FileSpreadsheet',
    keywords: ['pdf to jpg', 'pdf to image', 'extract pdf', 'convert pdf', 'export pages', 'high resolution'],
    status: 'implemented',
    route: '/tools/pdf-to-jpg',
    summary: 'High-fidelity PDF page extractor to standalone image files',
    targetAudience: ['Professionals extracting diagrams', 'Students sharing notes', 'Designers'],
    plannedFeatures: [
      'Page-by-page visual thumbnail selector',
      'Resolution control: Standard 150 DPI and High Quality 300 DPI',
      'Single page download or batch ZIP export',
      'Client-side Canvas rendering for maximum privacy'
    ],
    seoTitle: 'PDF to JPG Converter Online | India Smart Tools',
    seoDescription: 'Convert PDF pages to JPG images in high resolution. Free, private, and works on desktop and mobile browsers.'
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    slug: 'pdf-compressor',
    category: 'documents',
    description: 'Shrink PDF file sizes to under 100 KB, 200 KB, or 500 KB to meet strict limits on Indian government and recruitment portals.',
    icon: 'Minimize2',
    keywords: ['pdf compressor', 'reduce pdf size', 'compress pdf', '100kb', '200kb', 'upsc upload', 'ssc upload', 'portal limit'],
    status: 'implemented',
    route: '/tools/pdf-compressor',
    summary: 'Targeted size compressor for government & academic portals',
    targetAudience: ['UPSC/SSC candidates', 'Passport applicants', 'EPFO/Income tax uploaders'],
    plannedFeatures: [
      'Target file size presets: Under 100 KB, Under 200 KB, and Under 500 KB',
      'Preserves readable text quality while compressing embedded images',
      'Before-and-after size comparison preview with percentage reduction',
      'Zero server upload: Processing handled securely on device'
    ],
    seoTitle: 'Compress PDF Online | India Smart Tools',
    seoDescription: 'Compress PDF files to under 100KB or 200KB for government job portals, university admissions, and online forms.'
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'documents',
    description: 'Reduce photo and signature file sizes to under 20 KB or 50 KB without blurriness for online exam and job applications.',
    icon: 'Shrink',
    keywords: ['image compressor', 'photo compress', 'signature compress', '20kb photo', '50kb photo', 'upsc photo', 'passport photo'],
    status: 'implemented',
    route: '/tools/image-compressor',
    summary: 'Exact KB-target image compressor for applicant photos and signatures',
    targetAudience: ['Govt exam applicants', 'Recruitment portal users', 'Web creators'],
    plannedFeatures: [
      'One-click presets: Photo (< 50 KB), Signature (< 20 KB), Web (< 100 KB)',
      'Live interactive visual quality slider with instant output size feedback',
      'Supports JPG, PNG, and WebP compression formats',
      'Batch compression for multiple certificates simultaneously'
    ],
    seoTitle: 'Image Compressor Online | India Smart Tools',
    seoDescription: 'Compress passport photos and signatures to under 20KB or 50KB for UPSC, SSC, IBPS, and state portal submissions.'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    category: 'documents',
    description: 'Resize passport photos to exact pixel dimensions (e.g. 350x450 px, 200x230 px) with aspect-ratio lock and DPI options.',
    icon: 'Maximize2',
    keywords: ['image resizer', 'resize photo', 'dimensions', 'pixel resize', '3.5 x 4.5 cm', 'passport size', 'aspect ratio'],
    status: 'implemented',
    route: '/tools/image-resizer',
    summary: 'Pixel and centimeter precision photo dimension adjuster',
    targetAudience: ['Passport/visa applicants', 'Admit card submission seekers', 'Form uploaders'],
    plannedFeatures: [
      'Standard Indian portal dimension presets (UPSC 350x350, SSC 200x230, Passport 35x45mm)',
      'Custom Width x Height with optional aspect ratio lock',
      'Centimeter to Pixel conversion at 200/300 DPI standards',
      'Built-in center crop and smart framing tool'
    ],
    seoTitle: 'Resize Image Online | India Smart Tools',
    seoDescription: 'Resize photos to exact pixel dimensions (350x350, 200x230) and passport dimensions for Indian online government applications.'
  },

  // 4. Everyday Tools
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    slug: 'qr-generator',
    category: 'everyday',
    description: 'Create customized, high-resolution QR codes for UPI payments, website URLs, Wi-Fi passwords, and contact vCards.',
    icon: 'QrCode',
    keywords: ['qr code', 'qr generator', 'upi qr', 'gpay', 'phonepe', 'wifi qr', 'vcard', 'barcode'],
    status: 'implemented',
    route: '/tools/qr-generator',
    summary: 'Instant QR code creator with UPI payment and Wi-Fi presets',
    targetAudience: ['Shopkeepers', 'Event hosts', 'Freelancers', 'Small merchants'],
    plannedFeatures: [
      'UPI payment QR: Preset Payee VPA, name, and optional fixed amount',
      'URL, plain text, Wi-Fi credentials, and contact vCard generation',
      'Download in crisp PNG and scalable SVG formats',
      'High error correction option (Level H) for printed QR durability'
    ],
    seoTitle: 'Free QR Code Generator – UPI, URL & Wi-Fi QR Codes | India Smart Tools',
    seoDescription: 'Generate custom QR codes online for free. Create UPI payment QRs, Wi-Fi access codes, links, and vCards instantly.'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    category: 'everyday',
    description: 'Generate uncrackable, cryptographically secure passwords and memorable passphrases with entropy strength indicators.',
    icon: 'KeyRound',
    keywords: ['password generator', 'strong password', 'security', 'random password', 'passphrase', 'entropy', 'pin'],
    status: 'implemented',
    route: '/tools/password-generator',
    summary: 'Cryptographically secure password & memorable passphrase maker',
    targetAudience: ['Online banking users', 'IT professionals', 'Security conscious users'],
    plannedFeatures: [
      'Cryptographically random generation using Web Crypto API',
      'Customizable length (8 to 64 chars) and character sets (Symbols, Digits, Ambiguous exclusion)',
      'Memorable passphrase mode using readable word combinations',
      'Live entropy bit score and cracking resistance estimation'
    ],
    seoTitle: 'Strong Password Generator – Secure & Random | India Smart Tools',
    seoDescription: 'Generate strong, secure passwords and memorable passphrases with custom length and symbols. 100% private in browser.'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    category: 'everyday',
    description: 'Convert length, weight, area, volume, temperature, and traditional Indian land units (Bigha, Guntha, Ground, Marla, Gaj).',
    icon: 'ArrowRightLeft',
    keywords: ['unit converter', 'convert', 'bigha', 'guntha', 'gaj', 'sq ft', 'kg to lbs', 'meters', 'acre', 'celsius'],
    status: 'implemented',
    route: '/tools/unit-converter',
    summary: 'Comprehensive converter with traditional Indian land measurements',
    targetAudience: ['Real estate buyers', 'Engineers', 'Farmers', 'Students'],
    plannedFeatures: [
      'Traditional Indian land unit conversions: Bigha, Guntha, Ground, Marla, Kanal, Gaj to Sq Ft / Acres',
      'Standard scientific units: Length, Mass, Volume, Temperature, Speed, and Digital Storage',
      'Bidirectional instantaneous calculation with swap trigger',
      'Copyable result with formula notation'
    ],
    seoTitle: 'Unit Converter – Metric & Indian Land Units (Bigha, Guntha, Gaj) | India Smart Tools',
    seoDescription: 'Convert units of length, area, weight, and traditional Indian land measurements including Bigha, Guntha, Gaj, and Sq Ft.'
  },
  {
    id: 'date-difference',
    name: 'Date Difference',
    slug: 'date-difference',
    category: 'everyday',
    description: 'Calculate exact duration between two calendar dates in years, months, weeks, days, and working business days.',
    icon: 'CalendarDays',
    keywords: ['date difference', 'days between dates', 'date calculator', 'working days', 'tenure', 'service period', 'calendar'],
    status: 'implemented',
    route: '/tools/date-difference',
    summary: 'Accurate calendar day and working business day counter',
    targetAudience: ['HR professionals calculating service tenure', 'Project managers', 'Legal researchers'],
    plannedFeatures: [
      'Exact span breakdown: Years, months, days, total weeks, and total days',
      'Business working days mode excluding Saturdays and Sundays',
      'Add or subtract days/weeks/months to compute future or past deadlines',
      'Leap year and daylight precision calculation'
    ],
    seoTitle: 'Date Difference Calculator – Days Between Dates | India Smart Tools',
    seoDescription: 'Calculate the exact number of days, weeks, months, and working days between two dates with leap year accuracy.'
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'everyday',
    description: 'Calculate Body Mass Index based on standard WHO guidelines and Asian-Indian adjusted BMI thresholds for health risk evaluation.',
    icon: 'Activity',
    keywords: ['bmi calculator', 'body mass index', 'weight', 'height', 'asian bmi', 'health', 'fitness', 'ideal weight'],
    status: 'implemented',
    route: '/tools/bmi-calculator',
    summary: 'Standard WHO & Asian-Indian cutoff health metric evaluator',
    targetAudience: ['Fitness enthusiasts', 'Health conscious individuals', 'Medical students'],
    plannedFeatures: [
      'Dual metric system: cm / kg and ft-inches / lbs',
      'Asian-Indian consensus thresholds (Overweight at >= 23, Obese at >= 25)',
      'Healthy weight range indicator for target height',
      'Interactive visual BMI category scale gauge'
    ],
    seoTitle: 'BMI Calculator (WHO & Asian-Indian Cutoffs) | India Smart Tools',
    seoDescription: 'Calculate your Body Mass Index (BMI) with Asian-Indian adjusted cutoffs. Check healthy weight range and health categories.'
  }
];

// Helper queries
export function getAllTools(): ToolItem[] {
  return TOOLS;
}

export function getToolsByCategory(category: ToolCategory): ToolItem[] {
  return TOOLS.filter(t => t.category === category);
}

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getCategoryById(id: ToolCategory): CategoryItem | undefined {
  const cat = CATEGORIES.find(c => c.id === id);
  if (!cat) return undefined;
  return {
    ...cat,
    toolCount: TOOLS.filter(t => t.category === id).length
  };
}

export function getCategoryBySlug(slug: string): CategoryItem | undefined {
  const cat = CATEGORIES.find(c => c.slug === slug);
  if (!cat) return undefined;
  return {
    ...cat,
    toolCount: TOOLS.filter(t => t.slug === slug).length
  };
}

export function searchTools(query: string, categoryFilter?: ToolCategory | 'all'): ToolItem[] {
  // Cap query length to 100 characters to prevent ReDoS / CPU exhaustion
  const clean = query.trim().slice(0, 100).toLowerCase();

  const pool = categoryFilter && categoryFilter !== 'all'
    ? TOOLS.filter(t => t.category === categoryFilter)
    : TOOLS;

  if (!clean) return pool;

  interface ScoredTool {
    tool: ToolItem;
    score: number;
  }

  const scored: ScoredTool[] = [];

  for (const tool of pool) {
    const nameLower = tool.name.toLowerCase();
    const catLower = tool.category.toLowerCase();
    const descLower = tool.description.toLowerCase();
    const keywords = (tool.keywords || []).map(k => k.toLowerCase());

    let score = 0;

    // 1. Exact Tool Name Match (1000 pts)
    if (nameLower === clean) {
      score = 1000;
    }
    // 2. Tool Name Starts With Query (800 pts)
    else if (nameLower.startsWith(clean)) {
      score = 800;
    }
    // 3. Tool Name Word Boundary Match (600 pts)
    else if (nameLower.split(/\s+/).some(word => word.startsWith(clean))) {
      score = 600;
    }
    // 3b. Tool Name Substring Match (500 pts)
    else if (nameLower.includes(clean)) {
      score = 500;
    }
    // 4. Keyword Exact Match (400 pts)
    else if (keywords.some(k => k === clean)) {
      score = 400;
    }
    // 4b. Keyword Prefix Match (350 pts)
    else if (keywords.some(k => k.startsWith(clean))) {
      score = 350;
    }
    // 4c. Keyword Substring Match (300 pts)
    else if (keywords.some(k => k.includes(clean))) {
      score = 300;
    }
    // 5. Category Match (200 pts)
    else if (catLower === clean || catLower.startsWith(clean)) {
      score = 200;
    }
    // 6. Description Substring Match (100 pts)
    else if (descLower.includes(clean)) {
      score = 100;
    }

    if (score > 0) {
      scored.push({ tool, score });
    }
  }

  // Sort descending by score, tie-breaking alphabetically by tool name
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.tool.name.localeCompare(b.tool.name);
  });

  return scored.map(s => s.tool);
}
