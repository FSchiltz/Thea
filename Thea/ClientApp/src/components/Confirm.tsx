import React, { MouseEventHandler } from "react";

interface ConfirmProps {
    handleSubmit: MouseEventHandler<HTMLButtonElement>;
    handleClose: MouseEventHandler<HTMLButtonElement>;
    isOpen: boolean;
    text: string;
}

const Confirm = ({ handleSubmit, handleClose, isOpen, text }: ConfirmProps) => {
    const active = isOpen ? "is-active" : "";

    return (<div className={`modal ${active}`}>
        <div className="modal-background"></div>
        <div className='modal-content'>
            <div className='content box is-size-3'>
                {text}
                <div className="level">
                    <div className="level-left">

                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button" onClick={handleClose}>Cancel</button>
                        </div>
                        <div className="level-item">
                            <button className="button is-danger" onClick={handleSubmit}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div >);
}

export default Confirm;