import React, { useEffect, useCallback } from 'react';
import Timer from 'easytimer.js';
import { Button } from './Buttons';
import './Controls.css';

type ControlsProps = {
  timerState: TimerState;
  dispatchTimerState: React.Dispatch<ACTIONTYPE>;
  timer: Timer;
  audioRef: React.RefObject<HTMLAudioElement>;
};

export const Controls: React.VFC<ControlsProps> = ({
  timerState,
  dispatchTimerState,
  timer,
  audioRef,
}) => {
  const timerStart = useCallback(
    (timer: Timer) => {
      console.log('timerstart');
      dispatchTimerState({
        type: 'timerStart',
        timer: timer,
        dispatchTimerState: dispatchTimerState,
      });
      console.log('timerstart1a');
    },
    [dispatchTimerState]
  );

  useEffect(() => {
    const changeLabel = (timer: Timer) => {
      console.log('timer change');
      dispatchTimerState({ type: 'changeLabel' });
      timerStart(timer);
    };

    const changeSegement = () => {
      if (audioRef.current !== null) {
        audioRef.current.play(); //try to overcome ref could be null compile error, not sure if this is the best approach, change when understanding is better. Maybe have this check at the start?
      }
      changeLabel(timer);
    };

    timer.addEventListener('targetAchieved', changeSegement);
    // returned function will be called on component unmount
    return () => {
      timer.removeEventListener('targetAchieved', changeSegement);
    };
  }, [audioRef, dispatchTimerState, timer, timerStart]);

  const startPauseCommand = () => {
    console.log(
      'startpausebutton, timerState.started: ' +
        timerState.started +
        ', timerState.paused: ' +
        timerState.paused
    );
    if (timerState.started === false) {
      console.log('start');
      timerStart(timer);
      dispatchTimerState({ type: 'setStarted', state: true });
      console.log('start1');
    } else if (timerState.started === true && timerState.paused === false) {
      console.log('pause');
      timer.pause();
      dispatchTimerState({ type: 'setPaused', state: true });
    } else if (timerState.started === true && timerState.paused === true) {
      console.log('restart');
      timer.start();
      dispatchTimerState({ type: 'setPaused', state: false });
    }
  };

  const resetCommand = () => {
    timer.stop();
    if (audioRef.current !== null) {
      //is audio doesn't load then it doesn't play
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    dispatchTimerState({ type: 'setDefault' });
  };

  return (
    <div id="controls">
      <div id="break-label">Break</div>
      <div id="break-length" className="length">
        {timerState.breakLength}
      </div>
      <div id="session-label">Session</div>
      <div id="session-length" className="length">
        {timerState.sessionLength}
      </div>
      <div className="center">
        <Button
          id="start_stop"
          label={
            !timerState.started ? (
              <i className="fas fa-play-circle"></i>
            ) : timerState.paused ? (
              <i className="fas fa-play-circle"></i>
            ) : (
              <i className="fas fa-pause-circle"></i>
            )
          }
          onClick={startPauseCommand}
        />
        <Button
          id="reset"
          label={<i className="fas fa-undo"></i>}
          onClick={resetCommand}
        />
      </div>
      <Button
        id="break-decrement"
        label={<i className="fas fa-chevron-circle-down"></i>}
        onClick={() => dispatchTimerState({ type: 'breakDecrement' })}
      />
      <Button
        id="break-increment"
        label={<i className="fas fa-chevron-circle-up"></i>}
        onClick={() => dispatchTimerState({ type: 'breakIncrement' })}
      />
      <Button
        id="session-decrement"
        label={<i className="fas fa-chevron-circle-down"></i>}
        onClick={() => dispatchTimerState({ type: 'sessionDecrement' })}
      />
      <Button
        id="session-increment"
        label={<i className="fas fa-chevron-circle-up"></i>}
        onClick={() => dispatchTimerState({ type: 'sessionIncrement' })}
      />
    </div>
  );
};
