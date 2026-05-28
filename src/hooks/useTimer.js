import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Countdown timer hook with pause/resume and vibration support.
 *
 * @param {object} options
 * @param {Function} options.onComplete - Callback when timer reaches zero
 * @returns {object} Timer state and controls
 */
export function useTimer({ onComplete } = {}) {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);

          // Vibrate on completion
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 300]);
          }

          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const start = useCallback((seconds) => {
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(true);
    setIsVisible(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true);
    }
  }, [remainingSeconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  const skip = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(0);
    setIsVisible(false);
  }, []);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setIsRunning(false);
    setRemainingSeconds(0);
  }, []);

  const addTime = useCallback((seconds) => {
    setRemainingSeconds((prev) => prev + seconds);
    setTotalSeconds((prev) => prev + seconds);
  }, []);

  // Computed values
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const displayTime = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return {
    totalSeconds,
    remainingSeconds,
    isRunning,
    isVisible,
    progress,
    displayTime,
    minutes,
    seconds,
    start,
    pause,
    resume,
    reset,
    skip,
    dismiss,
    addTime,
  };
}
