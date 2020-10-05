type TimerState = {
  breakLength: number;
  sessionLength: number;
  currentTime: string;
  started: boolean;
  paused: boolean;
  label: string;
};

type ACTIONTYPE =
  | { type: 'breakDecrement' }
  | { type: 'breakIncrement' }
  | { type: 'sessionDecrement' }
  | { type: 'sessionIncrement' }
  | { type: 'setCurrentTime'; timer: Timer }
  | { type: 'setStarted'; state: boolean }
  | { type: 'setPaused'; state: boolean }
  | { type: 'setDefault' }
  | {
      type: 'timerStart';
      timer: Timer;
      dispatchTimerState: React.Dispatch<ACTIONTYPE>;
    }
  | { type: 'changeLabel' };
