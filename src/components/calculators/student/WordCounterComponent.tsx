import React, { useState, useMemo } from 'react';
import { analyzeText } from '../../../utils/calculators/wordCounter';
import { safeClipboardCopy } from '../../../utils/security';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import { Copy, Trash2, Clock, BookOpen, Mic, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SAMPLE_TEXT = `Knowledge is the foundation of human progress, cultural exchange, and technological innovation. From ancient academies and great historical libraries to modern international universities and digital laboratories, education remains an enduring pillar of human civilization.

Students and scholars across the world explore sciences, arts, languages, and engineering with extraordinary curiosity, determination, and creative focus.`;

export const WordCounterComponent: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const metrics = useMemo(() => {
    return analyzeText(text);
  }, [text]);

  const handleCopy = async () => {
    if (!text.trim()) {
      showToast('No text to copy.', 'info');
      return;
    }
    const success = await safeClipboardCopy(text);
    if (success) {
      setCopied(true);
      showToast('Text copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    if (!text) return;
    setText('');
    showToast('Text cleared.', 'info');
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    showToast('Sample essay loaded.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Words</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-0.5 block">
            {metrics.wordCount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Characters</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-0.5 block">
            {metrics.characterCount.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">({metrics.charactersNoSpaces} without space)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Sentences</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-0.5 block">
            {metrics.sentenceCount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Paragraphs</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-0.5 block">
            {metrics.paragraphCount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Reading Time</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-0.5 block">
            ~{metrics.readingTimeMinutes}m
          </span>
          <span className="text-[10px] text-slate-400">at 200 words/min</span>
        </div>
      </div>

      {/* Main Textarea Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Your Text / Essay</span>
            <span className="text-xs text-slate-400">·</span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer"
            >
              Load Sample Text
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!text.trim()}
              icon={copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!text}
              icon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Text input area */}
        <div>
          <label htmlFor="word-counter-textarea" className="sr-only">
            Text to analyze
          </label>
          <textarea
            id="word-counter-textarea"
            rows={10}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste your text here to count words, characters, sentences, and estimated reading time..."
            className="w-full bg-slate-50/50 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors leading-relaxed"
          />
        </div>

        {/* Secondary Detailed Metrics & Privacy Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Speaking Duration (130 wpm):</span>
              <span className="font-semibold text-slate-900 font-mono">~{metrics.speakingTimeMinutes} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Avg Words Per Sentence:</span>
              <span className="font-semibold text-slate-900 font-mono">{metrics.avgWordsPerSentence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Avg Characters Per Word:</span>
              <span className="font-semibold text-slate-900 font-mono">{metrics.avgCharsPerWord}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Private & Local:</strong> Your text is processed entirely in your browser memory. We never transmit, store, or profile your personal writing, SOPs, or assignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
