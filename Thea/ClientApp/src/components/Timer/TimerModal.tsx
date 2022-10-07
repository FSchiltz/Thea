import React, { CSSProperties, MouseEventHandler } from 'react';
import { getTime } from '../../helpers/Time';
import Tea from '../../model/Tea';
import CountdownTimer from './CountdownTimer';

interface TimerModalProps {
    duration?: Date;
    notifyDone: () => void;
    closePopup: MouseEventHandler<HTMLButtonElement>;
    tea?: Tea;
    timerOn: boolean;
}

export default function TimerModal({ duration, notifyDone, closePopup, tea, timerOn }: TimerModalProps) {
    if (!duration || !tea)
        return <div></div>;

    const active = timerOn ? "is-active" : "";

    
    let color: CSSProperties = {};
    if (tea.color) {
        color.background = tea.color;
    }

    return <div className={`modal ${active}`}>
        <div className="modal-background"></div>
        <div className='modal-content' style={color}>
            <div className='content box'>
                <p className="is-size-3">{tea.name}</p>

                <div className='content'>
                    <CountdownTimer targetDate={duration} total={getTime(new Date(duration))} callback={notifyDone} />
                </div>
                <div className="level">
                    <div className="level-left">
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button" onClick={closePopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}
