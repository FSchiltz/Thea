import React, { ChangeEvent, MouseEventHandler, useState } from "react";
import Tea from "../../model/Tea";

interface ImportModalProps {
    display: boolean;
    close: MouseEventHandler<HTMLButtonElement>;
    save: (jso: string) => {};
}

export default function ImportModal({ display, close, save }: ImportModalProps) {
    const example = new Tea();
    example.description = 'Description';
    example.name = 'Name';
    example.duration = '00:05:12';
    const [value, setValue] = useState(JSON.stringify( [example], null, 2));

    const active = display ? "is-active" : '';

    let saveHandler = () => {
        if (save)
            save(value);
    };

    let handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    }

    return <div className={`modal ${active}`}>
        <div className="modal-background"></div>
        <div className='modal-content'>
            <div className="content box">
                <span className="is-size-3">Import</span>
                <div className="p-4">
                    <textarea  className="textarea" value={value} onChange={handleChange} />
                </div>
                <div className="level">
                    <div className="level-left">
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button is-success" onClick={saveHandler}>Save changes</button>
                        </div>
                        <div className="level-item">
                            <button className="button" onClick={close}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div >
}