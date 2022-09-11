const Confirm = ({ handleSubmit, handleDisable, handleClose, isOpen, text, isAlreadyDisabled }) => {
    const active = isOpen !== null ? "is-active" : "";
    const disableClass = 'level-item' + ((isAlreadyDisabled) ? ' is-hidden' : '');

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
                        <div className={disableClass}>
                            <button className="button is-warning" onClick={handleDisable}>Disable</button>
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