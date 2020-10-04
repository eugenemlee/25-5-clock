import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Timer from 'easytimer.js';

let useReducer = React.useReducer;
let useEffect = React.useEffect;
let useRef = React.useRef;
let useState = React.useState;

const BREAKMINIMUM = 1;
const BREAKMAXIMUM = 60;
const SESSIONMINIMUM = 1;
const SESSIONMAXIMUM = 60;

const initialTimerState = {
  breakLength: 5,
  sessionLength: 25,
  currentTime: "25:00",
  started: false,
  paused: false,
  label: "SESSION"
};

type TimerState = {
  breakLength: number;
  sessionLength: number;
  currentTime: string;
  started: boolean;
  paused: boolean;
  label: string;
}

function App() {
  const [timer, setTimer] = useState(new Timer());
  const [timerState, dispatchTimerState] = useReducer(reducerTimerState, initialTimerState);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div id="timer-main" className="my-3 p-3 bg-white shadow-lg container-sm">
      <Display timerState={timerState} />
      <Controls timerState={timerState} dispatchTimerState={dispatchTimerState} timer={timer} audioRef={audioRef} />
      <audio id="beep" preload="auto" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
  );
};

function minutesToClock(minutes: number) {
  //used to format the clock displays 00:00
  let date = new Date(0);
  date.setMinutes(minutes);
  return date.toISOString().substr(14, 5);
}


type displayProps = {
  timerState: TimerState;
}

function Display({timerState}: displayProps): JSX.Element {
  return (
    <div id="display-container" className="card my-3">
      <div id="timer-label"><h1>{timerState.label}</h1></div>
      <div id="time-left">{timerState.currentTime}</div>
    </div>
  );
};

type ACTIONTYPE =
  | {type: "breakDecrement"}
  | {type: "breakIncrement"}
  | {type: "sessionDecrement"}
  | {type: "sessionIncrement"}
  | {type: "setCurrentTime"; timer:Timer}
  | {type: "setStarted"; state:boolean}
  | {type: "setPaused"; state:boolean }
  | {type: "setDefault"}
  | {type: "timerStart"; timer:Timer; dispatchTimerState: React.Dispatch<ACTIONTYPE>}
  | {type: "changeLabel"};

function reducerTimerState(state: TimerState, action: ACTIONTYPE): TimerState {
  switch (action.type) {
    case 'breakDecrement':
      if (state.breakLength > BREAKMINIMUM && !state.started) {
        return { ...state, breakLength: state.breakLength - 1 };
      }
      return state;
    case 'breakIncrement':
      if (state.breakLength < BREAKMAXIMUM && !state.started) {
        return { ...state, breakLength: state.breakLength + 1 };
      }
      return state;
    case 'sessionDecrement':
      if (state.sessionLength > SESSIONMINIMUM && !state.started) {
        return { ...state, sessionLength: state.sessionLength - 1, currentTime: minutesToClock(state.sessionLength - 1) };
      }
      return state;
    case 'sessionIncrement':
      if (state.sessionLength < SESSIONMAXIMUM && !state.started) {
        if (state.sessionLength + 1 === 60) {// special case for 60 minutes
          return { ...state, sessionLength: state.sessionLength + 1, currentTime: "60:00" };
        } else {
          return { ...state, sessionLength: state.sessionLength + 1, currentTime: minutesToClock(state.sessionLength + 1) };
        }
      }
      return state;
    case 'setCurrentTime':
      return { ...state, currentTime: action.timer.getTimeValues().toString(['minutes', 'seconds']) };
    case 'setStarted':
      return { ...state, started: action.state };
    case 'setPaused':
      return { ...state, paused: action.state };
    case 'setDefault':
      return { ...initialTimerState };
    case 'timerStart':
      action.timer.start({
        countdown: true,
        startValues: { minutes: state.label === "SESSION" ? state.sessionLength : state.breakLength },
        callback: () => { action.dispatchTimerState({ type: "setCurrentTime", timer: action.timer }) }
      });
      return state;
    case 'changeLabel':
      if (state.label === "SESSION") {
        return { ...state, label: "BREAK" };
      } else if (state.label === "BREAK") {
        return { ...state, label: "SESSION" };
      }
      throw new Error();

    default:
      throw new Error();
  }
}

type controlProps = {
  timerState: TimerState;
  dispatchTimerState: React.Dispatch<ACTIONTYPE>;
  timer: Timer;
  audioRef: React.RefObject<HTMLAudioElement>;
};

function Controls({timerState,dispatchTimerState,timer,audioRef}:controlProps): JSX.Element {
  useEffect(() => {
    
    const changeSegement = () => {
      if(audioRef.current !== null){
        audioRef.current.play(); //try to overcome ref could be null compile error, not sure if this is the best approach, change when understanding is better. Maybe have this check at the start?
      }
        changeLabel(timer);
    }
    
    timer.addEventListener('targetAchieved',changeSegement);
    // returned function will be called on component unmount 
    return () => {
      timer.removeEventListener('targetAchieved',changeSegement);
    }
  }, []);

  const startPauseCommand = () => {
    console.log("startpausebutton, timerState.started: " + timerState.started + ", timerState.paused: " + timerState.paused);
    if (timerState.started === false) {
      console.log("start");
      timerStart(timer);
      dispatchTimerState({ type: "setStarted", state: true });
      console.log("start1");
    } else if (timerState.started === true && timerState.paused === false) {
      console.log("pause");
      timer.pause();
      dispatchTimerState({ type: "setPaused", state: true });
    } else if (timerState.started === true && timerState.paused === true) {
      console.log("restart");
      timer.start();
      dispatchTimerState({ type: "setPaused", state: false });
    }
  }

  const timerStart = (timer:Timer) => {
    console.log("timerstart");
    dispatchTimerState({ type: "timerStart", timer: timer, dispatchTimerState: dispatchTimerState });
    console.log("timerstart1a");
  }

  const changeLabel = (timer:Timer) => {
    console.log("timer change");
    dispatchTimerState({ type: "changeLabel"});
    timerStart(timer);
  }

  const resetCommand = () => {
    timer.stop();
    if(audioRef.current !== null){ //is audio doesn't load then it doesn't play
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    dispatchTimerState({ type: "setDefault"});
  }

  return (
    <div id="controls">
      <div id="break-label">Break</div>
      <div id="break-length" className="length">{timerState.breakLength}</div>
      <div id="session-label">Session</div>
      <div id="session-length" className="length">{timerState.sessionLength}</div>
      <div className="center">
        <Button id="start_stop" label={!timerState.started ? '<i class="fas fa-play-circle"></i>' : timerState.paused ? '<i class="fas fa-play-circle"></i>' : '<i class="fas fa-pause-circle"></i>'} onClick={startPauseCommand} />
        <Button id="reset" label='<i class="fas fa-undo"></i>' onClick={resetCommand} />
      </div>
      <Button id="break-decrement" label='<i class="fas fa-chevron-circle-down"></i>' onClick={() => dispatchTimerState({ type: "breakDecrement" })} />
      <Button id="break-increment" label='<i class="fas fa-chevron-circle-up"></i>' onClick={() => dispatchTimerState({ type: "breakIncrement" })} />
      <Button id="session-decrement" label='<i class="fas fa-chevron-circle-down"></i>' onClick={() => dispatchTimerState({ type: "sessionDecrement" })} />
      <Button id="session-increment" label='<i class="fas fa-chevron-circle-up"></i>' onClick={() => dispatchTimerState({ type: "sessionIncrement" })} />
    </div>
  );
}

type buttonProps = {
  id:string;
  label: string;
  onClick(event: React.MouseEvent<HTMLElement>): void;
};

function Button({id,label,onClick}: buttonProps) : JSX.Element {
  return (
    <div id={id} className={"button"} onClick={onClick} dangerouslySetInnerHTML={{ __html: label }}>
    </div>
  );
}

export default App;
