import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calculator as CalcIcon,
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Folder,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Plus,
  Trash2,
  ExternalLink,
  Smartphone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  RotateCcw,
  Fingerprint,
  History,
  KeyRound,
  FileUp,
  Share2,
  Clock,
  Delete as BackspaceIcon,
  Divide,
  Percent,
  Equal
} from 'lucide-react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────
// HIGH-PERFORMANCE MATHEMATICAL EVALUATION ENGINE
// Evaluates arbitrary chained expressions with BODMAS / PEMDAS
// Supports: Multi-digit, Decimals, Unary Minus (e.g. 4×-5), Postfix %
// ─────────────────────────────────────────────────────────────
export function evaluateExpression(expr: string): number | null {
  if (!expr || expr.trim() === '') return null;

  // Clean and normalize
  const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');

  const tokens: (number | string)[] = [];
  let i = 0;
  let lastToken: number | string | null = null;

  while (i < sanitized.length) {
    const ch = sanitized[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Unary minus: at start or immediately following an operator or opening parenthesis
    if (ch === '-' && (lastToken === null || ['+', '-', '*', '/', '(', '%'].includes(lastToken as string))) {
      i++;
      let numStr = '-';
      while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
        numStr += sanitized[i];
        i++;
      }
      if (numStr === '-') return null; // trailing incomplete minus
      const num = parseFloat(numStr);
      if (isNaN(num)) return null;
      tokens.push(num);
      lastToken = num;
      continue;
    }

    // Numbers & decimals
    if (/[0-9]/.test(ch) || (ch === '.' && (lastToken === null || typeof lastToken !== 'number'))) {
      let numStr = '';
      while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
        numStr += sanitized[i];
        i++;
      }
      const num = parseFloat(numStr);
      if (isNaN(num)) return null;
      tokens.push(num);
      lastToken = num;
      continue;
    }

    // Operators and parentheses
    if (['+', '-', '*', '/', '(', ')', '%'].includes(ch)) {
      tokens.push(ch);
      lastToken = ch;
      i++;
      continue;
    }

    return null; // Unrecognized character
  }

  if (tokens.length === 0) return null;

  // Postfix % processing (e.g. 50% = 0.5)
  const processedTokens: (number | string)[] = [];
  for (let j = 0; j < tokens.length; j++) {
    if (tokens[j] === '%') {
      if (processedTokens.length === 0) return null;
      const prev = processedTokens.pop();
      if (typeof prev !== 'number') return null;
      processedTokens.push(prev / 100);
    } else {
      processedTokens.push(tokens[j]);
    }
  }

  // Shunting-Yard Algorithm to Reverse Polish Notation (RPN)
  const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const outputQueue: (number | string)[] = [];
  const operatorStack: string[] = [];

  for (const token of processedTokens) {
    if (typeof token === 'number') {
      outputQueue.push(token);
    } else if (token in precedence) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] in precedence &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token as string);
    } else if (token === '(') {
      operatorStack.push(token as string);
    } else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) return null; // Mismatched parentheses
      operatorStack.pop(); // Remove '('
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op === '(' || op === ')') return null;
    outputQueue.push(op);
  }

  // Evaluate RPN Stack
  const evalStack: number[] = [];
  for (const token of outputQueue) {
    if (typeof token === 'number') {
      evalStack.push(token);
    } else {
      if (evalStack.length < 2) return null;
      const b = evalStack.pop()!;
      const a = evalStack.pop()!;
      let res = 0;
      if (token === '+') res = a + b;
      else if (token === '-') res = a - b;
      else if (token === '*') res = a * b;
      else if (token === '/') {
        if (b === 0) return null; // Division by zero
        res = a / b;
      }
      evalStack.push(res);
    }
  }

  if (evalStack.length !== 1) return null;
  const finalVal = evalStack[0];
  if (!isFinite(finalVal) || isNaN(finalVal)) return null;

  // Format cleanly without floating-point artifacts
  return parseFloat(finalVal.toPrecision(12));
}

export const PrivateCalculatorComponent: React.FC = () => {
  const { showToast } = useToast();

  // ─────────────────────────────────────────────────────────────
  // 1. ULTRA-FAST EXPRESSION-BASED CALCULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [expression, setExpression] = useState<string>('4×-5-2+5-5÷5+5');
  const [livePreview, setLivePreview] = useState<string>('-13');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-demo',
      expression: '4×-5-2+5-5÷5+5 =',
      result: '-13',
      timestamp: Date.now() - 60000
    }
  ]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  // ─────────────────────────────────────────────────────────────
  // 2. SECRET PIN & VAULT PREVIEW STATE
  // ─────────────────────────────────────────────────────────────
  const [secretPin, setSecretPin] = useState<string>('1234');
  const [isEditingPin, setIsEditingPin] = useState<boolean>(false);
  const [newPinInput, setNewPinInput] = useState<string>('1234');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);
  const [pinNotice, setPinNotice] = useState<string | null>(null);

  const expressionDisplayRef = useRef<HTMLDivElement>(null);

  // Blinking green cursor simulation matching the screenshot
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Compute live preview instantly on every expression change
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setLivePreview('');
      return;
    }

    // Check if the current expression is just the PIN
    if (expression.trim() === secretPin.trim()) {
      setLivePreview('Unlock Vault');
      return;
    }

    const result = evaluateExpression(expression);
    if (result !== null) {
      setLivePreview(String(result));
    } else {
      // Incomplete formula or syntax error during active typing
      setLivePreview('');
    }

    // Auto-scroll expression line to right as user types many numbers
    if (expressionDisplayRef.current) {
      expressionDisplayRef.current.scrollLeft = expressionDisplayRef.current.scrollWidth;
    }
  }, [expression, secretPin]);

  // Check if expression matches secret PIN
  const checkPinTrigger = (candidate: string) => {
    if (candidate.trim() === secretPin.trim() && secretPin.trim().length > 0) {
      setIsVaultUnlocked(true);
      setPinNotice('Secret PIN recognized! Private Vault preview mode activated.');
      showToast('Secret PIN matched! Private Vault preview opened.', 'success');
      return true;
    }
    return false;
  };

  // ─────────────────────────────────────────────────────────────
  // KEYPAD ACTIONS (INSTANTANEOUS)
  // ─────────────────────────────────────────────────────────────
  const handleDigit = useCallback((digit: string) => {
    setExpression(prev => {
      if (prev === '0' || prev === 'Error' || prev === 'Cannot divide by 0') {
        return digit;
      }
      return prev + digit;
    });
  }, []);

  const handleOperator = useCallback((op: string) => {
    setExpression(prev => {
      if (!prev || prev === 'Error' || prev === 'Cannot divide by 0') {
        return op === '-' ? '-' : `0${op}`;
      }

      const lastChar = prev.slice(-1);

      // Support unary negative numbers after multiplication/division (e.g. "4×-")
      if ((lastChar === '×' || lastChar === '÷') && op === '-') {
        return prev + '-';
      }

      // If last char is already an operator and user presses another (except unary minus)
      if (['+', '-', '×', '÷'].includes(lastChar)) {
        // Check if there are two operators (e.g. "×-")
        const secondLast = prev.length >= 2 ? prev.slice(-2, -1) : '';
        if (['×', '÷'].includes(secondLast) && lastChar === '-') {
          return prev.slice(0, -2) + op;
        }
        return prev.slice(0, -1) + op;
      }

      return prev + op;
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setExpression(prev => {
      if (!prev || prev === 'Error' || prev === 'Cannot divide by 0') {
        return '0.';
      }

      // Check current number segment (since last operator)
      const segments = prev.split(/[+\-×÷()]/);
      const currentSegment = segments[segments.length - 1];

      if (currentSegment.includes('.')) {
        return prev; // Disallow multiple decimals in same number
      }

      if (currentSegment === '') {
        return prev + '0.';
      }

      return prev + '.';
    });
  }, []);

  const handlePercent = useCallback(() => {
    setExpression(prev => {
      if (!prev || prev === 'Error' || prev === 'Cannot divide by 0') return prev;
      const lastChar = prev.slice(-1);
      if (['+', '-', '×', '÷', '%'].includes(lastChar)) return prev;
      return prev + '%';
    });
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setLivePreview('');
  }, []);

  const handleBackspace = useCallback(() => {
    setExpression(prev => {
      if (!prev || prev === 'Error' || prev.length <= 1) {
        return '';
      }
      return prev.slice(0, -1);
    });
  }, []);

  const handleParentheses = useCallback(() => {
    setExpression(prev => {
      if (!prev) return '(';
      const openCount = (prev.match(/\(/g) || []).length;
      const closeCount = (prev.match(/\)/g) || []).length;
      const lastChar = prev.slice(-1);

      if (['+', '-', '×', '÷', '('].includes(lastChar)) {
        return prev + '(';
      }
      if (openCount > closeCount && !['+', '-', '×', '÷', '('].includes(lastChar)) {
        return prev + ')';
      }
      return prev + '×(';
    });
  }, []);

  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    // 1. Check Secret PIN first
    if (checkPinTrigger(expression)) {
      return;
    }

    const result = evaluateExpression(expression);

    if (result === null) {
      // If division by zero or invalid syntax
      if (expression.includes('÷0') || expression.includes('/0')) {
        setLivePreview('');
        setExpression('Cannot divide by 0');
      } else {
        showToast('Please complete the expression before evaluating.', 'info');
      }
      return;
    }

    const resString = String(result);
    const newEntry: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      expression: `${expression} =`,
      result: resString,
      timestamp: Date.now()
    };

    setHistory(prev => [newEntry, ...prev.slice(0, 24)]);
    setExpression(resString);
    setLivePreview('');
  }, [expression, secretPin]);

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        handleOperator(e.key);
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercent();
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleParentheses();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleBackspace, handleClear, handlePercent, handleParentheses]);

  const handleFeaturePreviewAction = (actionName: string) => {
    showToast(`"${actionName}" is a planned feature for the upcoming native Android app.`, 'info');
  };

  return (
    <div className="space-y-8">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: THE HIGH-SPEED CALCULATOR (MATCHING SCREENSHOT)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Calculator Body */}
        <div className="lg:col-span-7 bg-black rounded-3xl border border-slate-800 shadow-2xl overflow-hidden transition-colors">
          
          {/* Top Header Bar inside Calculator Screen */}
          <div className="px-6 pt-5 pb-2 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Calculator
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  showHistory
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Calculation History"
                aria-label="Toggle History"
              >
                <Clock className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setExpression('');
                  setLivePreview('');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                title="Clear screen"
                aria-label="Clear screen"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* History Drawer Overlay (if opened) */}
          {showHistory && (
            <div className="mx-5 my-2 p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto space-y-2 animate-in fade-in-0 duration-150">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Calculation History</span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHistory([])}
                    className="text-rose-400 hover:text-rose-300 text-[11px] font-medium cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-slate-500 text-center py-3">No history yet.</p>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setExpression(item.result);
                      setShowHistory(false);
                    }}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-900 cursor-pointer transition-colors"
                  >
                    <span className="font-mono text-slate-400 truncate max-w-[200px]">{item.expression}</span>
                    <span className="font-mono font-bold text-emerald-400 ml-2">{item.result}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Screen Display Area (Replicating Screenshot Exactly) */}
          <div className="px-6 pt-4 pb-6 min-h-[170px] flex flex-col justify-end text-right">
            
            {/* Long Multi-Number Formula Display with Blinking Cursor */}
            <div
              ref={expressionDisplayRef}
              className="font-mono text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-tight break-all overflow-x-auto whitespace-pre-wrap select-all leading-snug"
            >
              {expression || '0'}
              <span
                className={`inline-block w-1 sm:w-1.5 h-6 sm:h-8 -mb-0.5 ml-0.5 bg-emerald-400 rounded-xs transition-opacity duration-100 ${
                  cursorVisible ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              />
            </div>

            {/* Instant Live Calculated Preview Result (Right Aligned, Subdued Gray/White) */}
            <div className="mt-2 min-h-[36px] flex items-center justify-end">
              {livePreview && (
                <span className="font-mono text-xl sm:text-2xl font-bold text-slate-400 tracking-tight animate-in fade-in-0 duration-75">
                  {livePreview}
                </span>
              )}
            </div>

          </div>

          {/* Keypad Grid (Matches Android/Screenshot layout) */}
          <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-900 grid grid-cols-4 gap-3 sm:gap-4 select-none">
            
            {/* Row 1: C, %, ⌫, ÷ */}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 sm:h-16 rounded-full text-xl font-bold text-rose-500 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              C
            </button>
            <button
              type="button"
              onClick={handlePercent}
              className="h-14 sm:h-16 rounded-full text-xl font-bold text-emerald-400 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              %
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-14 sm:h-16 rounded-full text-xl font-bold text-emerald-400 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="Backspace"
              aria-label="Backspace"
            >
              <BackspaceIcon className="w-6 h-6 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={() => handleOperator('÷')}
              className="h-14 sm:h-16 rounded-full text-2xl font-bold text-emerald-400 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              ÷
            </button>

            {/* Row 2: 7, 8, 9, × */}
            <button
              type="button"
              onClick={() => handleDigit('7')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              7
            </button>
            <button
              type="button"
              onClick={() => handleDigit('8')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              8
            </button>
            <button
              type="button"
              onClick={() => handleDigit('9')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              9
            </button>
            <button
              type="button"
              onClick={() => handleOperator('×')}
              className="h-14 sm:h-16 rounded-full text-2xl font-bold text-emerald-400 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              ×
            </button>

            {/* Row 3: 4, 5, 6, - */}
            <button
              type="button"
              onClick={() => handleDigit('4')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              4
            </button>
            <button
              type="button"
              onClick={() => handleDigit('5')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              5
            </button>
            <button
              type="button"
              onClick={() => handleDigit('6')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              6
            </button>
            <button
              type="button"
              onClick={() => handleOperator('-')}
              className="h-14 sm:h-16 rounded-full text-2xl font-bold text-emerald-400 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              −
            </button>

            {/* Row 4: 1, 2, 3, + */}
            <button
              type="button"
              onClick={() => handleDigit('1')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => handleDigit('2')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => handleDigit('3')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => handleOperator('+')}
              className="h-14 sm:h-16 rounded-full text-2xl font-bold text-emerald-400 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              +
            </button>

            {/* Row 5: ( ), 0, ., = */}
            <button
              type="button"
              onClick={handleParentheses}
              className="h-14 sm:h-16 rounded-full text-lg font-bold text-emerald-400 hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="Parentheses"
            >
              ( )
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-14 sm:h-16 rounded-full text-2xl font-normal text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDecimal}
              className="h-14 sm:h-16 rounded-full text-2xl font-bold text-white hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleEquals}
              className="h-14 sm:h-16 rounded-3xl text-3xl font-bold bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/20"
              title="Calculate or Unlock with PIN"
              aria-label="Equals or Unlock"
            >
              =
            </button>

          </div>

          {/* Footer Bar with Keyboard Hint */}
          <div className="px-6 py-3 bg-black border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Fast chained BODMAS expression engine</span>
            <span className="hidden sm:inline">Keyboard supported (0-9, +, -, *, /, Enter, Backspace)</span>
          </div>

        </div>

        {/* Secret PIN Concept & Vault Trigger Sidecard */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Secret PIN Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-5 transition-colors shadow-2xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Secret PIN Concept
                </h2>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Interactive Concept
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In the planned native Android experience, entering your secret PIN on the calculator and pressing <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold">=</strong> will automatically unlock your Private Vault.
            </p>

            {/* Configured Demo PIN Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Demo PIN:</span>
                {!isEditingPin ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-emerald-400 px-2 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                      {secretPin}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPinInput(secretPin);
                        setIsEditingPin(true);
                      }}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      maxLength={8}
                      value={newPinInput}
                      onChange={e => setNewPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-20 px-2 py-1 text-xs font-mono rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      placeholder="PIN"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPinInput.length >= 3) {
                          setSecretPin(newPinInput);
                          setIsEditingPin(false);
                          showToast(`Demo PIN updated to ${newPinInput}`, 'success');
                        } else {
                          showToast('PIN should be at least 3 digits.', 'error');
                        }
                      }}
                      className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Type <strong className="text-slate-800 dark:text-slate-200 font-mono">{secretPin}</strong> into the calculator above and tap <strong>=</strong> to trigger the vault preview!
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setExpression(secretPin);
                  checkPinTrigger(secretPin);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Test Enter PIN ({secretPin}) & Unlock</span>
              </button>

              <button
                type="button"
                onClick={() => setShowComingSoonModal(true)}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private Vault — Coming Soon</span>
              </button>
            </div>

            {pinNotice && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span>{pinNotice}</span>
              </div>
            )}
          </div>

          {/* Privacy Architecture Notice Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-200">
              <Shield className="w-4 h-4 text-slate-700 dark:text-emerald-400 shrink-0" />
              <span>Zero-Cloud Storage Policy</span>
            </div>
            <p className="leading-relaxed">
              <strong>Your files will not be uploaded to Smartly Tools in this website version.</strong> This website does not accept, store, or transmit personal photos, videos, or documents.
            </p>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
              Future Private Vault will be designed as an Android app where private files can be stored in app-specific storage on the user's device.
            </p>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: FUTURE VAULT PREVIEW INTERFACE
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors shadow-2xs">
        
        {/* Header with Coming Soon Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center">
                {isVaultUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                🔐 Private Vault
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                COMING SOON
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isVaultUnlocked
                ? 'Preview Mode Unlocked — Visual demonstration of the planned native Android vault interface.'
                : 'Locked State — Enter the demo PIN above or click Coming Soon to preview.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowComingSoonModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Info Modal
            </button>
            {isVaultUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  setIsVaultUnlocked(false);
                  setPinNotice(null);
                  showToast('Private Vault preview locked.', 'info');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 transition-colors cursor-pointer"
              >
                Relock Vault
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsVaultUnlocked(true);
                  showToast('Private Vault preview mode opened.', 'success');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 transition-colors cursor-pointer"
              >
                Unlock Preview
              </button>
            )}
          </div>
        </div>

        {/* Explanatory Banner */}
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              Private Vault will be available in the future as a dedicated Android app. Your private files will be stored locally on your device instead of being uploaded to our servers.
            </p>
            <p className="text-amber-800/90 dark:text-amber-300/80 text-[11px]">
              The categories and action buttons below represent the interactive UI layout designed for the future mobile application. No actual files are accepted or stored in this web preview.
            </p>
          </div>
        </div>

        {/* Future Vault Category Cards (5 Categories) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <span>Planned Vault Categories (0 Files Stored)</span>
            <span className="text-[11px] lowercase font-normal italic">preview only · no upload allowed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            
            {/* 1. Photos */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>📷 Photos</span>
                  <span className="text-[10px] text-slate-400 font-normal">0 items</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Encrypted local photo gallery with hidden folder segregation.
                </p>
              </div>
              <span className="inline-block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>

            {/* 2. Videos */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>🎥 Videos</span>
                  <span className="text-[10px] text-slate-400 font-normal">0 items</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Private video player with sandboxed on-device decoding.
                </p>
              </div>
              <span className="inline-block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>

            {/* 3. Documents */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>📄 Documents</span>
                  <span className="text-[10px] text-slate-400 font-normal">0 items</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Confidential PDFs, marksheets, certificates, and ID records.
                </p>
              </div>
              <span className="inline-block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>

            {/* 4. Audio */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>🎵 Audio</span>
                  <span className="text-[10px] text-slate-400 font-normal">0 items</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Private voice memos, recordings, and audio files.
                </p>
              </div>
              <span className="inline-block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>

            {/* 5. Other Files */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>📁 Other Files</span>
                  <span className="text-[10px] text-slate-400 font-normal">0 items</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Archives, APKs, backups, and miscellaneous custom files.
                </p>
              </div>
              <span className="inline-block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>

          </div>
        </div>

        {/* Future Vault Actions Controls (Visually Disabled Preview) */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <span>Planned Vault Actions (Native Android Controls)</span>
            <span className="text-[11px] lowercase font-normal italic">controls disabled on website</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleFeaturePreviewAction('Import File')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-700/60 cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity"
              title="Disabled in web version — Planned for Android app"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Import File</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">Soon</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeaturePreviewAction('View File')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-700/60 cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity"
              title="Disabled in web version — Planned for Android app"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>👁 View</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">Soon</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeaturePreviewAction('Lock Vault')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-700/60 cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity"
              title="Disabled in web version — Planned for Android app"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>🔒 Lock</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">Soon</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeaturePreviewAction('Export File')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-700/60 cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity"
              title="Disabled in web version — Planned for Android app"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>↗ Export</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">Soon</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeaturePreviewAction('Delete File')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-700/60 cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity"
              title="Disabled in web version — Planned for Android app"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>🗑 Delete</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">Soon</span>
            </button>
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: FUTURE ANDROID APP CONCEPT — HOW IT WILL WORK
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
        
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Future Android App — How It Will Work
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A planned native mobile architecture engineered around Android app-specific private storage.
          </p>
        </div>

        {/* 6 Step Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Choose a file</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
              Select any personal photo, video, document, or audio clip directly from your device storage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Move into Private Vault</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
              Transfer the selected file into the app's sandboxed environment with a single tap.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Stored Privately on Device</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
              The file is stored inside Android app-specific internal storage and hidden from public gallery scanners.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Open Calculator & Enter PIN</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
              The app behaves as a regular calculator until your secret PIN is keyed in and confirmed with "=".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                5
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Access the Private Vault</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
              The calculator interface slides away to reveal your protected personal media folders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                6
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">View, Restore or Export</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
              Inspect your files inside the private viewer, restore them to public folders, or export when desired.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: SECURITY CONCEPT & FEATURE PREVIEWS
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
        
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Security Architecture & Planned Safeguards
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Realistic, verifiable privacy principles planned for the mobile application. No exaggerated or misleading claims.
          </p>
        </div>

        {/* 6 Security Concept Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>🔐 Secure PIN</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Custom numeric passcodes derived using secure hashing functions (PBKDF2/Argon2) without plaintext storage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>🔒 Auto Lock</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Immediate vault lock when switching apps, minimizing background activity, or when the screen turns off.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>🛡️ Private App Storage</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Leverages Android's native app-isolated private sandbox so external apps cannot read vault data.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
              <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>🚫 No Cloud Upload</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pure local storage model. Smartly Tools maintains no remote file servers, reducing data breach exposure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
              <Fingerprint className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>👆 Optional Biometric Unlock</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Opt-in fingerprint or device biometric authentication leveraging Android BiometricPrompt hardware security.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>⏱️ Failed-Attempt Protection</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Exponential cooldown periods after repeated unsuccessful PIN attempts to deter brute-force guessing.
            </p>
          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: COMING SOON MODAL
      ───────────────────────────────────────────────────────────── */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            
            <button
              type="button"
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  🔐 Private Vault
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Feature In Development
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-y border-slate-100 dark:border-slate-800 py-3.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Private Vault is currently under development.
              </p>
              <p>
                Coming soon as a dedicated Android experience. Your private files will be stored locally on your device in app-specific storage instead of being uploaded to our servers.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-[11px] space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Privacy Assurance:</span>
                <p className="text-slate-500 dark:text-slate-400">
                  This website version does not accept, upload, or store user media. The online calculator operates 100% locally in your browser.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowComingSoonModal(false)}
                className="w-full sm:w-auto"
              >
                Got it
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
