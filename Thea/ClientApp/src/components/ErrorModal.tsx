import React, { MouseEventHandler } from "react";


interface ErrorModalProps {
    error?: string;
    close: MouseEventHandler<HTMLButtonElement>;
}

export default function ErrorModal({ error, close }: ErrorModalProps) {
    const active = error ? "is-active" : '';

    return <div className={`modal ${active}`}>
        <div className="modal-background"></div>
        <div className='modal-content has-background-danger'>
            <div className="content box">
                <span className="is-size-3">Error</span>
                <div className="p-4">
                    {error}
                </div>
                <div className="level">
                    <div className="level-left">
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button" onClick={close}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div >
}