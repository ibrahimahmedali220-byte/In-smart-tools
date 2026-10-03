# Design System & UI Specification

## India Smart Tools

**Brand Name:** India Smart Tools  
**Tagline:** "Simple tools for everyday India."  
**Brand Personality:** Premium, Modern, Trustworthy, Fast, Simple, Professional, Mobile-first.  
**Governing Rule:** Anti-slop discipline: No excessive gradients, no static pill badge sandwiches, no mechanical code prefixes (`//`), no fake testimonials or mock statistics.

---

## 1. Color System

The interface uses a disciplined **60-30-10** color distribution:
- **60% Dominant Neutral Canvas**: Clean background field (`bg-slate-50`, `#f8fafc`).
- **30% Structural Surfaces**: Pure white cards (`bg-white`), hairline borders (`border-slate-200/80`), and subdued slate typography (`text-slate-600`).
- **10% Accent Budget**: High-intent primary action color (`bg-slate-900`, hover `bg-slate-800`).

### Palette Tokens:
| Token | Tailwind Class | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas** | `bg-slate-50` | `#f8fafc` | Global body background |
| **Surface** | `bg-white` | `#ffffff` | Cards, inputs, header, modal background |
| **Surface Subtle** | `bg-slate-100` | `#f1f5f9` | Icon containers, segmented tab backgrounds |
| **Border Hairline**| `border-slate-200`| `#e2e8f0` | Card borders, dividing rules, inputs |
| **Border Subtle** | `border-slate-100`| `#f1f5f9` | Inner section dividers |
| **Text Primary** | `text-slate-900` | `#0f172a` | Headings, tool names, strong labels |
| **Text Secondary**| `text-slate-600` | `#475569` | Body paragraphs, descriptions |
| **Text Muted** | `text-slate-400` | `#94a3b8` | Placeholders, breadcrumb chevrons, shortcuts |
| **Primary Action** | `bg-slate-900` | `#0f172a` | Primary CTA buttons, active filter tabs |
| **Success** | `text-emerald-600`| `#059669` | Success toasts, valid state indicators |
| **Error / Alert** | `text-red-600` | `#dc2626` | Form validation errors, error banners |
| **Focus Ring** | `ring-slate-900` | `#0f172a` | Accessible `focus-visible` outline rings |

---

## 2. Typography

### Font Family
- **Primary Face**: `Plus Jakarta Sans`, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
- **Weights Used**: Regular (400), Medium (500), SemiBold (600), Bold (700).
- **Monospace Face**: System monospace (`font-mono`) for keyboard shortcuts (`⌘K`), code values, and tabular figures.

### Typographic Hierarchy:
| Level | Desktop Size | Mobile Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `text-5xl` (48px) | `text-3xl` (30px) | Bold (700) | `tracking-tight` | Homepage hero headline |
| **Section Header** | `text-3xl` (30px) | `text-2xl` (24px) | Bold (700) | `tracking-tight` | Category & directory page headers |
| **Card / Subtitle**| `text-base` (16px) | `text-base` (16px) | SemiBold (600) | Normal | Tool card names, modal titles |
| **Body Regular** | `text-sm` (14px) | `text-sm` (14px) | Regular (400) | Normal | Descriptions, long prose, form fields |
| **Body Small** | `text-xs` (12px) | `text-xs` (12px) | Medium (500) | Normal | Card descriptions, metadata, button labels |
| **Micro Caption** | `text-[11px]` (11px)| `text-[11px]` (11px)| SemiBold (600) | `tracking-wider` | Uppercase category kickers, footer subtext |

### Zero-Pill Metadata Rule:
Metadata (categories, publication dates, statuses) must never be enclosed in colored candy pill capsules. Render as clean unboxed text separated by typographic middots:
```tsx
<div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
  <span>Finance</span>
  <span aria-hidden="true" className="text-slate-300">·</span>
  <span className="text-slate-400">Specification Ready</span>
</div>
```

---

## 3. Spacing & Spatial Geometry

- **Base Spacing Grid**: 4px scale (`p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).
- **Spatial Padding Rule**: Container outer padding $\ge$ inner gap between children.
  - Page containers: `px-4 sm:px-6 lg:px-8 py-8 md:py-12`.
  - Cards: `p-5` to `p-8`.
  - Buttons: Horizontal padding $\approx 2\times$ vertical padding (`px-4 py-2` or `px-5 py-2.5`).

---

## 4. Border Radius & Elevation Scale

- **Small Radius** (`rounded-md`, 6px): Keyboard shortcuts, small chips, dropdown options.
- **Medium Radius** (`rounded-lg`, 8px): Buttons, form inputs, icon containers.
- **Card Radius** (`rounded-xl`, 12px): Tool cards, modal dialogs, empty-state containers.
- **Hero / Surface Radius** (`rounded-2xl`, 16px): Large showcase sections, about page cards.
- **Elevation / Shadows**:
  - `shadow-sm`: Cards on subtle hover, primary buttons.
  - `shadow-md`: Mobile navigation drawer.
  - `shadow-xl`: Modal dialogs and instant search overlay.

---

## 5. Component Specifications

### Buttons (`src/components/common/Button.tsx`)
- **Variants**:
  - `primary`: `bg-slate-900 text-white hover:bg-slate-800`
  - `secondary`: `bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200/60`
  - `outline`: `border border-slate-300 text-slate-800 bg-white hover:bg-slate-50`
  - `ghost`: `text-slate-700 hover:bg-slate-100 hover:text-slate-900`
  - `danger`: `bg-red-600 text-white hover:bg-red-700`
- **Sizes**:
  - `sm`: `text-xs px-3 py-1.5 h-8 gap-1.5`
  - `md`: `text-sm px-4 py-2 h-10 gap-2`
  - `lg`: `text-base px-5 py-2.5 h-12 gap-2.5`
- **Controls**: `whitespace-nowrap shrink-0 active:scale-[0.98] focus-visible:ring-2`.

### Inputs (`src/components/common/Input.tsx`)
- Rounded `rounded-lg`, `border-slate-300`, focus state `focus:ring-1 focus:ring-slate-900 focus:border-slate-900`.
- Integrated start icon slot (e.g. Search icon) and end icon clear triggers.
- Clear error text in `text-xs text-red-600 font-medium`.

### Tool Cards (`src/components/common/ToolCard.tsx`)
- Top row: 40x40px icon box (`bg-slate-100`), unboxed category metadata.
- Middle row: Tool title with hover diagonal arrow (`ArrowUpRight`), 2-line clamped description.
- Bottom row: Hairline top border with `View Blueprint →` affordance.
- Hover state: Border turns `border-slate-300`, subtle shadow appears, icon box transitions to `bg-slate-900 text-white`.

### Search Component (`src/components/common/SearchTools.tsx`)
- Inline bar on Home and Directory pages; global Modal triggered anywhere via `⌘K` / `Ctrl+K`.
- Instant keyboard navigation: Arrow Up/Down to traverse list, Enter to navigate, ESC to dismiss.

---

## 6. Layout & Navigation Contract

### Top Bar Contract
One-row, three-zone layout:
1. **Brand Zone**: Single text element wordmark (`India Smart Tools`). No extra location badges or status tags.
2. **Nav Links Zone**: 5 clean text links (`Home`, `Tools`, `Categories`, `About`, `Contact`) with subtle hover underlines and active indicators.
3. **Primary Action Zone**: Desktop search trigger with `⌘K` shortcut badge; mobile hamburger icon.

### Mobile Navigation Drawer
- Slides down on toggle. Includes quick full-width search bar, large touchable navigation links (minimum 44px height), and category shortcuts.

### Footer Contract
- 5-column responsive layout: Brand Wordmark & Mission, Tools, Company, Legal, Support.
- Bottom copyright bar: `© 2026 India Smart Tools. All rights reserved.`
- No fake social media accounts or artificial testimonials.

---

## 7. Responsive Breakpoints

| Breakpoint | Minimum Width | Target Devices | Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Default** | `< 640px` | Small to large smartphones | Single column grid, mobile drawer navigation |
| **`sm`** | `640px` | Large phones, phablets | 2-column tool grids |
| **`md`** | `768px` | Tablets, iPad Portrait | Desktop top bar, 2-to-3 column grids |
| **`lg`** | `1024px` | Laptops, iPad Landscape | 3-column tool grids, 4-column categories |
| **`xl`** | `1280px` | Desktop monitors | 4-column tool grids |

---

## 9. Financial Calculator UI Patterns & Data Visualization

Part 6 established a unified design pattern across all calculation utilities:

### A. Two-Column Workspace Layout (7:5 Ratio):
- **Left Column (7 cols)**: Input controls, tactile range sliders, unit toggles (Years/Months), and quick preset chips.
- **Right Column (5 cols)**: High-contrast Dark Summary Card (`bg-slate-900 text-white`) highlighting the primary computed metric in large bold typography (`text-3xl sm:text-4xl`), accompanied by itemized sub-totals and a visual distribution progress bar.

### B. Dual-Control Input Pattern (`CalculatorInput`):
- Pairs direct numeric entry with synchronized tactile range sliders.
- Displays appropriate currency prefix (`₹`) or unit suffix (`%`, `Yrs`, `Mos`).
- Includes quick-selection preset chips (`₹10L`, `₹25L`, `8.5%`, `12%`) for frictionless one-tap adjustments on mobile.

### C. Zero-Dependency Data Visualizer (`DistributionBar`):
- Accessible stacked progress bar (`role="progressbar"`) displaying relative shares (e.g. Principal vs Interest, Invested vs Return) without requiring heavy chart libraries.
- Features high-contrast color coding: white/slate for principal, amber-500 for interest, emerald-500 for investment returns.

### D. Amortization & Tabular Schedules:
- Clean data tables with alternating row hovers, horizontal touch scrolling (`overflow-x-auto`) on mobile, and monospace alignment for currency figures.

