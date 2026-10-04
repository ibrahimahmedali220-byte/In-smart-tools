import { ToolCategory, ToolItem, CategoryItem } from '../types/tool';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'everyday',
    name: 'Everyday Tools',
    slug: 'everyday',
    tagline: 'Practical utilities for daily digital productivity',
    description: 'Instant QR generation with logo, secure passwords, date math, metric conversions, and health metrics.',
    icon: 'Sparkles',
    route: '/tools/everyday'
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
    id: 'finance',
    name: 'Finance Tools',
    slug: 'finance',
    tagline: 'Smart money calculators for households and professionals',
    description: 'Accurate interest, loan, investment, and tax utilities tuned to financial standards and schemes.',
    icon: 'Landmark',
    route: '/tools/finance'
  },
  {
    id: 'student',
    name: 'Student Tools',
    slug: 'student',
    tagline: 'Academic aids for schools, colleges, and competitive exams',
    description: 'Fast grade converters, study focus timers, age checkers, and text analysis tools for learners worldwide.',
    icon: 'GraduationCap',
    route: '/tools/student'
  }
];

export const TOOLS: ToolItem[] = [
  // Top Featured Tools: QR Code Generator & JPG to PDF (Position 1 & 2)
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    slug: 'qr-generator',
    category: 'everyday',
    description: 'Create customized, high-resolution QR codes with custom center logos for UPI payments, website URLs, Wi-Fi passwords, and WhatsApp sharing.',
    icon: 'QrCode',
    keywords: ['qr code', 'qr generator', 'upi qr', 'gpay', 'phonepe', 'wifi qr', 'vcard', 'barcode', 'logo qr'],
    status: 'implemented',
    route: '/tools/qr-generator',
    summary: 'Instant QR code creator with logo embedding, UPI payment and WhatsApp sharing',
    targetAudience: ['Shopkeepers', 'Event hosts', 'Freelancers', 'Small merchants'],
    plannedFeatures: [
      'UPI payment QR: Preset Payee VPA, name, and optional fixed amount',
      'Upload brand logo / picture embedded directly in the center of the QR code',
      'Direct WhatsApp and Instagram sharing options with high error resilience',
      'Download in crisp PNG and scalable SVG formats'
    ],
    seoTitle: 'Free QR Code Generator with Logo – UPI, URL & Wi-Fi QR Codes | Smartly Tools',
    seoDescription: 'Generate custom QR codes online for free with logo embedding. Create UPI payment QRs, Wi-Fi access codes, and links with WhatsApp sharing.'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    category: 'documents',
    description: 'Combine multiple JPG, JPEG, and PNG images into a single clean PDF document securely inside your browser with WhatsApp sharing.',
    icon: 'FileImage',
    keywords: ['jpg to pdf', 'image to pdf', 'photo to pdf', 'convert', 'document', 'aadhaar', 'pan card', 'marksheet', 'pdf maker'],
    status: 'implemented',
    route: '/tools/jpg-to-pdf',
    summary: 'Fast in-browser photo-to-PDF compiler with page reordering and direct sharing',
    targetAudience: ['Job portal applicants', 'Students submitting scanned assignments', 'Office administrators'],
    plannedFeatures: [
      '100% Client-side conversion: Photos never upload to external servers',
      'Drag-and-drop reordering of multiple pages before compilation',
      'Direct WhatsApp and social sharing options',
      'Orientation controls: Portrait and Landscape per page'
    ],
    seoTitle: 'JPG to PDF Converter Online | Smartly Tools',
    seoDescription: 'Convert JPG images to PDF documents online for free. 100% private, runs in browser, perfect for marksheets and certificates.'
  },

  // Finance Tools (Directly below Top Tools)
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
      'Standard reducing balance formula (P x R x (1+R)^N / ((1+R)^N - 1))',
      'Pre-payment impact and tenure reduction modeling',
      'Year-by-year and month-by-month principal vs interest schedule',
      'Instant shareable loan summary PDF export'
    ],
    seoTitle: 'EMI Calculator – Home, Car & Personal Loan EMI | Smartly Tools',
    seoDescription: 'Free online EMI Calculator for bank loans. Calculate loan EMIs, interest payable, and monthly payment schedules.'
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
    seoTitle: 'SIP Calculator – Mutual Fund Returns & Growth Projection | Smartly Tools',
    seoDescription: 'Calculate expected returns on mutual fund SIP investments with step-up increments and inflation adjustments.'
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    category: 'finance',
    description: 'Compute inclusive and exclusive Goods and Services Tax for all standard GST slabs (5%, 12%, 18%, 28%).',
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
    seoTitle: 'GST Calculator – Inclusive & Exclusive GST Rates | Smartly Tools',
    seoDescription: 'Fast, free GST calculator for businesses and freelancers. Calculate 5%, 12%, 18%, and 28% GST with CGST/SGST split.'
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    category: 'finance',
    description: 'Convert annual Cost to Company (CTC) into realistic in-hand monthly take-home pay under old and new tax regimes.',
    icon: 'Landmark',
    keywords: ['salary', 'ctc', 'take home', 'in hand', 'income tax', 'epf', 'pf', 'professional tax', 'tds', 'form 16'],
    status: 'implemented',
    route: '/tools/salary-calculator',
    summary: 'CTC to monthly in-hand wage estimator with tax regime comparison',
    targetAudience: ['Job offer evaluators', 'Salaried employees', 'HR teams'],
    plannedFeatures: [
      'New vs Old tax regime comparison for FY 2025-26 / 2026-27',
      'Standard deduction (₹75,000 for New Regime), Section 87A rebate and Professional Tax deduction',
      'Customizable Basic Pay percentage and PF options',
      'Detailed itemized deduction breakdown table'
    ],
    seoTitle: 'In-Hand Salary Calculator (New vs Old Regime) | Smartly Tools',
    seoDescription: 'Calculate take-home salary from CTC. Compare New vs Old tax regimes with statutory withholdings and tax breakdown.'
  },
  {
    id: 'fd-calculator',
    name: 'FD Calculator',
    slug: 'fd-calculator',
    category: 'finance',
    description: 'Calculate Fixed Deposit maturity amount and earned interest across banks and institutions with quarterly compounding.',
    icon: 'Landmark',
    keywords: ['fd', 'fixed deposit', 'interest', 'maturity', 'bank fd', 'sbi fd', 'post office', 'term deposit', 'senior citizen'],
    status: 'implemented',
    route: '/tools/fd-calculator',
    summary: 'Bank & Post Office FD maturity solver with compounding options',
    targetAudience: ['Conservative savers', 'Senior citizens', 'Fixed income planners'],
    plannedFeatures: [
      'Compounding frequency options: Monthly, Quarterly (standard in commercial banks), Half-Yearly, Yearly',
      'Special Senior Citizen preferential interest rate toggle (+0.50%)',
      'Cumulative (re-investment) vs Non-Cumulative payout options',
      'Maturity date projection from deposit date'
    ],
    seoTitle: 'Fixed Deposit (FD) Calculator – Maturity & Interest | Smartly Tools',
    seoDescription: 'Calculate bank and fixed deposit (FD) maturity values, interest earned, and quarterly compounding.'
  },

  // Student Tools
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'student',
    description: 'Calculate marks percentage, aggregate scores across subjects, percentage increase/decrease, and discount values.',
    icon: 'Percent',
    keywords: ['percentage', 'marks percentage', 'exam marks', 'score', 'discount', 'aggregate', 'board exam', 'cbse'],
    status: 'implemented',
    route: '/tools/percentage-calculator',
    summary: 'Exam score percentage, subject aggregate, and percentage changes',
    targetAudience: ['School students', 'College applicants', 'Shoppers calculating discounts'],
    plannedFeatures: [
      'Exam marks percentage solver (Total Marks vs Obtained Marks)',
      'Multi-subject aggregate grade sheet calculator (Add up to 10 subjects)',
      'Percentage change calculator: Increase, decrease, and difference',
      'Reverse percentage solver: Find original value from percentage'
    ],
    seoTitle: 'Percentage Calculator – Exam Marks & Aggregate Scores | Smartly Tools',
    seoDescription: 'Calculate exam marks percentage, multi-subject aggregate scores, and percentage increase or decrease instantly.'
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    slug: 'cgpa-calculator',
    category: 'student',
    description: 'Convert Cumulative Grade Point Average (CGPA) and SGPA to percentage using CBSE (9.5x) or university-specific grading scales.',
    icon: 'GraduationCap',
    keywords: ['cgpa', 'sgpa', 'cgpa to percentage', 'gpa converter', 'cbse cgpa', 'university grades', 'grading scale'],
    status: 'implemented',
    route: '/tools/cgpa-calculator',
    summary: 'CGPA to percentage converter with CBSE and custom scale support',
    targetAudience: ['University students', 'CBSE high schoolers', 'Graduates applying for jobs'],
    plannedFeatures: [
      'Standard CBSE formula: CGPA x 9.5 = Percentage',
      'Custom university multiplier support (e.g. 10x, 9.0x, VTU, AKTU scales)',
      'Semester SGPA to cumulative CGPA aggregate calculator',
      'Equivalent classification output: Distinction, First Class, Second Class'
    ],
    seoTitle: 'CGPA to Percentage Calculator (CBSE & University Scales) | Smartly Tools',
    seoDescription: 'Convert CGPA to percentage using official CBSE multiplier (9.5) or custom university grading formulas easily.'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'student',
    description: 'Calculate precise chronological age in years, months, weeks, and days, including exact eligibility age on a specific cutoff date.',
    icon: 'Calendar',
    keywords: ['age calculator', 'date of birth', 'dob', 'how old am i', 'govt exam eligibility', 'cutoff date', 'age in days'],
    status: 'implemented',
    route: '/tools/age-calculator',
    summary: 'Precise chronological age and government exam cutoff eligibility solver',
    targetAudience: ['Government job applicants (UPSC, SSC, Banking)', 'School admission seekers', 'Curious individuals'],
    plannedFeatures: [
      'Exact age calculation in Years, Months, and Days from Date of Birth',
      'Target cutoff date mode for exam eligibility verification (e.g., Age as on 1st August)',
      'Total lived duration breakdown: Months, Weeks, Days, Hours, and Minutes',
      'Next birthday countdown timer and day of the week'
    ],
    seoTitle: 'Age Calculator — Exact Age on Specific Cutoff Date | Smartly Tools',
    seoDescription: 'Calculate your exact age in years, months, and days. Check exam eligibility on specific cutoff dates for UPSC, SSC, and state exams.'
  },
  {
    id: 'study-timer',
    name: 'Study Timer',
    slug: 'study-timer',
    category: 'student',
    description: 'Boost academic focus and retention with a Pomodoro study timer, interval break cues, and session tracking.',
    icon: 'Clock',
    keywords: ['study timer', 'pomodoro', 'focus timer', 'exam prep', 'study sessions', 'productivity', 'interval timer'],
    status: 'implemented',
    route: '/tools/study-timer',
    summary: 'Distraction-free Pomodoro study timer with break alerts',
    targetAudience: ['Competitive exam aspirants (JEE, NEET, UPSC)', 'College students', 'Self-directed learners'],
    plannedFeatures: [
      'Standard 25-min study / 5-min break Pomodoro intervals with sound notifications',
      'Custom interval configuration (e.g. 50-min study / 10-min break)',
      'Session counter tracking completed study rounds per day',
      'Full-screen distraction-free focus mode with dark background'
    ],
    seoTitle: 'Study Timer & Pomodoro for Exam Preparation | Smartly Tools',
    seoDescription: 'Stay focused during exam prep with this free online Pomodoro study timer. Custom intervals, break alerts, and full-screen mode.'
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
    seoTitle: 'Word Counter — Count Words & Characters | Smartly Tools',
    seoDescription: 'Count words, characters, sentences, and reading time instantly. Ideal for academic essays, SOPs, and competitive exams.'
  },

  // Document Tools (remaining)
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
    seoTitle: 'PDF to JPG Converter Online | Smartly Tools',
    seoDescription: 'Convert PDF pages to JPG images in high resolution. Free, private, and works on desktop and mobile browsers.'
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    slug: 'pdf-compressor',
    category: 'documents',
    description: 'Shrink PDF file sizes to under 100 KB, 200 KB, or 500 KB to meet strict limits on upload and recruitment portals.',
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
    seoTitle: 'Compress PDF Online | Smartly Tools',
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
    seoTitle: 'Image Compressor Online | Smartly Tools',
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
      'Standard portal dimension presets (350x350, 200x230, Passport 35x45mm)',
      'Custom Width x Height with optional aspect ratio lock',
      'Centimeter to Pixel conversion at 200/300 DPI standards',
      'Built-in center crop and smart framing tool'
    ],
    seoTitle: 'Resize Image Online | Smartly Tools',
    seoDescription: 'Resize photos to exact pixel dimensions (350x350, 200x230) and passport dimensions for online applications.'
  },

  // Everyday Tools (remaining)
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
    seoTitle: 'Strong Password Generator – Secure & Random | Smartly Tools',
    seoDescription: 'Generate strong, secure passwords and memorable passphrases with custom length and symbols. 100% private in browser.'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    category: 'everyday',
    description: 'Convert length, weight, area, volume, temperature, and regional land units (Bigha, Guntha, Ground, Marla, Gaj).',
    icon: 'ArrowRightLeft',
    keywords: ['unit converter', 'convert', 'bigha', 'guntha', 'gaj', 'sq ft', 'kg to lbs', 'meters', 'acre', 'celsius'],
    status: 'implemented',
    route: '/tools/unit-converter',
    summary: 'Comprehensive converter with regional land measurements',
    targetAudience: ['Real estate buyers', 'Engineers', 'Farmers', 'Students'],
    plannedFeatures: [
      'Regional land unit conversions: Bigha, Guntha, Ground, Marla, Kanal, Gaj to Sq Ft / Acres',
      'Standard scientific units: Length, Mass, Volume, Temperature, Speed, and Digital Storage',
      'Bidirectional instantaneous calculation with swap trigger',
      'Copyable result with formula notation'
    ],
    seoTitle: 'Unit Converter – Metric & Regional Land Units (Bigha, Guntha, Gaj) | Smartly Tools',
    seoDescription: 'Convert units of length, area, weight, and regional land measurements including Bigha, Guntha, Gaj, and Sq Ft.'
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
    seoTitle: 'Date Difference Calculator – Days Between Dates | Smartly Tools',
    seoDescription: 'Calculate the exact number of days, weeks, months, and working days between two dates with leap year accuracy.'
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'everyday',
    description: 'Calculate Body Mass Index based on standard WHO guidelines and Asian-adjusted BMI thresholds for health risk evaluation.',
    icon: 'Activity',
    keywords: ['bmi calculator', 'body mass index', 'weight', 'height', 'asian bmi', 'health', 'fitness', 'ideal weight'],
    status: 'implemented',
    route: '/tools/bmi-calculator',
    summary: 'Standard WHO & Asian cutoff health metric evaluator',
    targetAudience: ['Fitness enthusiasts', 'Health conscious individuals', 'Medical students'],
    plannedFeatures: [
      'Dual metric system: cm / kg and ft-inches / lbs',
      'Asian consensus thresholds (Overweight at >= 23, Obese at >= 25)',
      'Healthy weight range indicator for target height',
      'Interactive visual BMI category scale gauge'
    ],
    seoTitle: 'BMI Calculator (WHO & Asian Cutoffs) | Smartly Tools',
    seoDescription: 'Calculate your Body Mass Index (BMI) with Asian-adjusted cutoffs. Check healthy weight range and health categories.'
  },
  {
    id: 'private-calculator',
    name: 'Private Calculator',
    slug: 'private-calculator',
    category: 'everyday',
    description: 'A fully functional standard calculator with an interactive concept preview of the upcoming Android secret PIN Private Vault.',
    icon: 'Calculator',
    keywords: [
      'private calculator',
      'private vault',
      'secure calculator',
      'privacy calculator',
      'private file vault',
      'calculator vault',
      'secret pin calculator',
      'math calculator',
      'standard calculator'
    ],
    status: 'implemented',
    route: '/tools/private-calculator',
    summary: 'Standard math calculator with a conceptual preview of future Android secret PIN Private Vault',
    targetAudience: ['Everyday math users', 'Students', 'Professionals', 'Privacy-conscious mobile users'],
    plannedFeatures: [
      'Standard arithmetic with addition, subtraction, multiplication, division, and percentage',
      'Keyboard and touch-friendly responsive keypad with calculation history',
      'Interactive secret PIN concept demonstrating future Private Vault unlock trigger',
      'Visual architectural preview of future Android app-specific local file isolation'
    ],
    seoTitle: 'Private Calculator — Free Online Utility & Private Vault Preview | Smartly Tools',
    seoDescription: 'Use our fast, free online calculator for standard everyday arithmetic, and preview the upcoming Android-based Private Vault feature for local on-device file security.'
  },
  {
    id: 'private-calling',
    name: 'Private Calling',
    slug: 'private-calling',
    category: 'everyday',
    description: 'Talk without sharing your personal phone number.',
    badge: 'COMING SOON',
    icon: 'PhoneCall',
    keywords: ['private calling', 'masked call', 'anonymous call', 'hide number', 'privacy call', 'virtual number', 'proxy call', 'secure call'],
    status: 'in_development',
    route: '/tools/private-calling',
    summary: 'Secure masked-calling system using authorized calling infrastructure',
    targetAudience: ['Privacy-conscious callers', 'Online marketplace buyers & sellers', 'Freelancers & gig workers', 'Delivery coordinators'],
    plannedFeatures: [
      'Encrypted voice session routing through licensed telecom proxies',
      'Secure SMS OTP number verification before call session initiation',
      'Dynamic proxy allocation preventing direct phone number disclosure',
      'Anti-abuse rate limiting, spam prevention, and scam reporting controls'
    ],
    seoTitle: 'Private Calling — Smartly Tools | Coming Soon',
    seoDescription: 'Private Calling by Smartly Tools is a planned privacy-focused calling feature designed to help users communicate without unnecessarily exposing their personal phone numbers.'
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
