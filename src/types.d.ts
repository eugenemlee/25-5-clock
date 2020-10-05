type TimerState = {
  breakLength: number;
  sessionLength: number;
  currentTime: string;
  started: boolean;
  paused: boolean;
  label: string;
  timer: import('easytimer.js').Timer;
};

type ACTIONTYPE =
  | { type: 'breakDecrement' }
  | { type: 'breakIncrement' }
  | { type: 'sessionDecrement' }
  | { type: 'sessionIncrement' }
  | { type: 'setCurrentTime' }
  | { type: 'setStarted'; state: boolean }
  | { type: 'setPaused'; state: boolean }
  | { type: 'setDefault' }
  | {
      type: 'timerStart';
      dispatchTimerState: React.Dispatch<ACTIONTYPE>;
    }
  | { type: 'changeLabel' };
