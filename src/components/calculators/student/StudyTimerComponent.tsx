import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../../common/Button';
import { Play, Pause, RotateCcw, SkipForward, Bell, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../common/Toast';

export type SessionType = 'focus' | 'short_break' | 'long_break';

interface SessionConfig {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
}

const DEFAULT_CONFIG: SessionConfig = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15
};

export const StudyTimerComponent: React.FC = () => {
  const { showToast } = useToast();
  const [config, setConfig] = useState<SessionConfig>(DEFAULT_CONFIG);
  const [currentSession, setCurrentSession] = useState<SessionType>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Remaining time in milliseconds
  const [remainingMs, setRemainingMs] = useState<number>(DEFAULT_CONFIG.focusMinutes * 60 * 1000);

  // Time-based monotonic synchronization refs
  const endTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Get total duration for current session in ms
  const getCurrentDurationMs = useCallback((): number => {
    switch (currentSession) {
      case 'focus':
        return config.focusMinutes * 60 * 1000;
      case 'short_break':
        return config.shortBreakMinutes * 60 * 1000;
      case 'long_break':
        return config.longBreakMinutes * 60 * 1000;
    }
  }, [currentSession, config]);

  // Audio tone synthesizer using Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Friendly dual-tone chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio not supported or blocked by browser policy
    }
  }, [soundEnabled]);

  // Advance session
  const advanceSession = useCallback(() => {
    playChime();

    if (currentSession === 'focus') {
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);

      // Long break every 4 focus sessions
      if (nextCount % 4 === 0) {
        setCurrentSession('long_break');
        setRemainingMs(config.longBreakMinutes * 60 * 1000);
        showToast('Great job! 4 focus blocks complete. Take a 15-minute long break.', 'success');
      } else {
        setCurrentSession('short_break');
        setRemainingMs(config.shortBreakMinutes * 60 * 1000);
        showToast('Focus session complete! Time for a 5-minute breather.', 'success');
      }
    } else {
      setCurrentSession('focus');
      setRemainingMs(config.focusMinutes * 60 * 1000);
      showToast('Break is over. Ready for your next study block?', 'info');
    }

    setIsRunning(false);
    endTimeRef.current = null;
  }, [currentSession, completedSessions, config, playChime, showToast]);

  // Main time-based ticker: prevents drift during tab backgrounding / throttling
  useEffect(() => {
    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + remainingMs;
      }

      // Frequent 200ms tick to stay responsive
      timerIntervalRef.current = window.setInterval(() => {
        if (!endTimeRef.current) return;
        const now = Date.now();
        const diff = Math.max(0, endTimeRef.current - now);

        if (diff <= 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          setRemainingMs(0);
          advanceSession();
        } else {
          setRemainingMs(diff);
        }
      }, 200);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      endTimeRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRunning, advanceSession, remainingMs]);

  // Handle visibility change: instantly resynchronize with clock
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isRunning && endTimeRef.current) {
        const now = Date.now();
        const diff = Math.max(0, endTimeRef.current - now);
        if (diff <= 0) {
          setRemainingMs(0);
          advanceSession();
        } else {
          setRemainingMs(diff);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, advanceSession]);

  // Toggle start / pause
  const toggleTimer = () => {
    if (!isRunning) {
      endTimeRef.current = Date.now() + remainingMs;
      setIsRunning(true);
    } else {
      // Pause
      if (endTimeRef.current) {
        const currentDiff = Math.max(0, endTimeRef.current - Date.now());
        setRemainingMs(currentDiff);
      }
      setIsRunning(false);
      endTimeRef.current = null;
    }
  };

  // Reset current session
  const resetTimer = () => {
    setIsRunning(false);
    endTimeRef.current = null;
    setRemainingMs(getCurrentDurationMs());
  };

  // Switch session tab
  const switchSession = (type: SessionType) => {
    setIsRunning(false);
    endTimeRef.current = null;
    setCurrentSession(type);
    switch (type) {
      case 'focus':
        setRemainingMs(config.focusMinutes * 60 * 1000);
        break;
      case 'short_break':
        setRemainingMs(config.shortBreakMinutes * 60 * 1000);
        break;
      case 'long_break':
        setRemainingMs(config.longBreakMinutes * 60 * 1000);
        break;
    }
  };

  // Request browser notification only on explicit user click
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications not supported by this browser.', 'info');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      showToast('Study timer browser alerts enabled.', 'success');
    } else {
      setNotificationsEnabled(false);
      showToast('Notification permission was not granted.', 'info');
    }
  };

  // Format MM:SS
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage
  const totalMs = getCurrentDurationMs();
  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalMs - remainingMs) / totalMs) * 100)));

  return (
    <div className="space-y-8">
      {/* Session Type Segmented Controls */}
      <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-md mx-auto grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => switchSession('focus')}
          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            currentSession === 'focus'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Focus (25m)
        </button>
        <button
          type="button"
          onClick={() => switchSession('short_break')}
          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            currentSession === 'short_break'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          type="button"
          onClick={() => switchSession('long_break')}
          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            currentSession === 'long_break'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Main Countdown Display */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
            {currentSession === 'focus' ? 'Deep Work Session' : currentSession === 'short_break' ? 'Short Recovery' : 'Extended Rest Period'}
          </span>
          <div
            className="text-6xl sm:text-7xl font-extrabold font-mono text-slate-900 tracking-tight"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {timeFormatted}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              currentSession === 'focus' ? 'bg-slate-900' : 'bg-emerald-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="ghost"
            size="md"
            onClick={resetTimer}
            icon={<RotateCcw className="w-4 h-4" />}
            aria-label="Reset timer to beginning"
          >
            Reset
          </Button>

          <button
            type="button"
            onClick={toggleTimer}
            className={`min-w-[120px] sm:min-w-[140px] h-12 inline-flex items-center justify-center font-bold text-sm rounded-xl text-white shadow-sm transition-transform active:scale-95 cursor-pointer ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isRunning ? (
              <span className="inline-flex items-center gap-2">
                <Pause className="w-4 h-4" /> Pause
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Play className="w-4 h-4" /> Start
              </span>
            )}
          </button>

          <Button
            variant="outline"
            size="md"
            onClick={advanceSession}
            icon={<SkipForward className="w-4 h-4" />}
            aria-label="Skip to next session"
          >
            Skip
          </Button>
        </div>

        {/* Preferences & Sound Toggles */}
        <div className="border-t border-slate-100 pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Completed Sessions:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-900 font-bold">{completedSessions}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 cursor-pointer"
              title={soundEnabled ? 'Mute tone' : 'Enable tone'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-slate-800" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{soundEnabled ? 'Chime On' : 'Chime Off'}</span>
            </button>

            {!notificationsEnabled && 'Notification' in window && (
              <button
                type="button"
                onClick={requestNotificationPermission}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 cursor-pointer"
                title="Enable browser alerts"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                <span>Alerts</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
