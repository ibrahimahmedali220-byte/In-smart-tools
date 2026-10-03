/**
 * Unicode-Aware Text Analysis & Word Counter Engine
 * 
 * Supports multilingual text (English, Hindi, Bengali, Assamese, etc.)
 * accurately without miscounting spaces or formatting artifacts.
 */

export interface TextAnalysisResult {
  wordCount: number;
  characterCount: number;
  charactersNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  avgWordsPerSentence: number;
  avgCharsPerWord: number;
}

export function analyzeText(text: string): TextAnalysisResult {
  if (!text || typeof text !== 'string') {
    return {
      wordCount: 0,
      characterCount: 0,
      charactersNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      avgWordsPerSentence: 0,
      avgCharsPerWord: 0
    };
  }

  // 1. Character Counts
  const characterCount = text.length;
  // Strip whitespace chars (spaces, tabs, newlines)
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // 2. Word Count (Unicode-aware word boundary matching)
  // Match contiguous non-whitespace sequences or use Intl.Segmenter if supported
  let wordCount = 0;
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
      for (const segment of segmenter.segment(text)) {
        if (segment.isWordLike) {
          wordCount++;
        }
      }
    } catch {
      // Fallback regex if Segmenter throws
      const trimmed = text.trim();
      wordCount = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    }
  } else {
    const trimmed = text.trim();
    wordCount = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  }

  // 3. Sentence Count
  // Matches terminators: . ? ! and Devanagari/Bengali danda (।)
  const sentences = text
    .split(/[.?!।]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const sentenceCount = sentences.length > 0 ? sentences.length : (charactersNoSpaces > 0 ? 1 : 0);

  // 4. Paragraph Count
  const paragraphs = text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const paragraphCount = paragraphs.length;

  // 5. Estimated Reading & Speaking Times
  // Average silent reading speed: ~200 words/minute
  // Average speaking speed: ~130 words/minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const speakingTimeMinutes = Math.max(1, Math.ceil(wordCount / 130));

  // 6. Averages
  const avgWordsPerSentence = sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;
  const avgCharsPerWord = wordCount > 0 ? Math.round((charactersNoSpaces / wordCount) * 10) / 10 : 0;

  return {
    wordCount,
    characterCount,
    charactersNoSpaces,
    sentenceCount,
    paragraphCount,
    readingTimeMinutes: wordCount === 0 ? 0 : readingTimeMinutes,
    speakingTimeMinutes: wordCount === 0 ? 0 : speakingTimeMinutes,
    avgWordsPerSentence,
    avgCharsPerWord
  };
}
