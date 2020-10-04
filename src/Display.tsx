import React from 'react';

type displayProps = {
    timerState: TimerState;
}

export function Display({ timerState }: displayProps): JSX.Element {
    return (
        <div id="display-container" className="card my-3">
            <div id="timer-label"><h1>{timerState.label}</h1></div>
            <div id="time-left">{timerState.currentTime}</div>
        </div>
    );
};