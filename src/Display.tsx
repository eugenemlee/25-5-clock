import React from 'react';
import './Display.css';

type DisplayProps = {
  timerState: TimerState;
};

export const Display: React.VFC<DisplayProps> = ({ timerState }) => {
  return (
    <div id="display-container" className="card my-3">
      <div id="timer-label">
        <h1>{timerState.label}</h1>
      </div>
      <div id="time-left">{timerState.currentTime}</div>
    </div>
  );
};
