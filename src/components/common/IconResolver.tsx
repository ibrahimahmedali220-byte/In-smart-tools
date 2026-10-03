import React from 'react';
import {
  Calculator,
  TrendingUp,
  Receipt,
  BadgeIndianRupee,
  PiggyBank,
  Percent,
  Award,
  Calendar,
  Timer,
  AlignLeft,
  FileImage,
  FileSpreadsheet,
  Minimize2,
  Shrink,
  Maximize2,
  QrCode,
  KeyRound,
  ArrowRightLeft,
  CalendarDays,
  Activity,
  Landmark,
  GraduationCap,
  FileText,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  TrendingUp,
  Receipt,
  BadgeIndianRupee,
  PiggyBank,
  Percent,
  Award,
  Calendar,
  Timer,
  AlignLeft,
  FileImage,
  FileSpreadsheet,
  Minimize2,
  Shrink,
  Maximize2,
  QrCode,
  KeyRound,
  ArrowRightLeft,
  CalendarDays,
  Activity,
  Landmark,
  GraduationCap,
  FileText,
  Sparkles
};

export interface IconResolverProps {
  name: string;
  className?: string;
}

export const IconResolver: React.FC<IconResolverProps> = ({ name, className = 'w-5 h-5' }) => {
  const Component = ICON_MAP[name] || HelpCircle;
  return <Component className={className} />;
};
