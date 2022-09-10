import React from 'react';
import CountdownTimer from './CountdownTimer';
import { getTime } from '../hooks/useCountdown';

const TimerModal = ({ duration, notifyDone, closePopup, tea, timerOn }) => {
    if (duration) {
        const active = timerOn ? "is-active" : "";

        return <div className={`modal ${active}`}>
            <div className="modal-background"></div>
            <div className='modal-content'>
                <div className='modal-card'>
                    <header className="modal-card-head">
                        <p className="modal-card-title">{tea.name}</p>
                    </header>
                </div>
                <section className="modal-card-body">
                    <div className='content'>
                        <CountdownTimer targetDate={duration} total={getTime(new Date(duration))} callback={notifyDone} />
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button" onClick={closePopup}>Cancel</button>
                </footer>
            </div>
        </div>;
    }

}

export default TimerModal;