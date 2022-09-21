import React, { MouseEventHandler } from "react";
import Tea from "../../model/Tea";
import AddForm from "./AddForm";

interface AddModalProps {
    edit: boolean;
    add: boolean;
    newTea: Tea,
    formChanged: (name: Tea) => void;
    closeAddPopup:  MouseEventHandler<HTMLButtonElement>;
    saveNewTea: MouseEventHandler<HTMLButtonElement>;

}

export default function AddModal({ edit, add, newTea, formChanged, closeAddPopup, saveNewTea }: AddModalProps) {
    if (edit || add) {
        const active = "is-active";

        const title = edit ? "Edit" : "Add";

        return <div className={`modal ${active}`}>
            <div className="modal-background"></div>
            <div className='modal-content'>
                <div className="content box">
                    <span className="is-size-3">{title}</span>
                    <div className="p-4">
                        <AddForm onChange={formChanged} tea={newTea}></AddForm>
                    </div>
                    <div className="level">
                        <div className="level-left">
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                <button className="button is-success" onClick={saveNewTea}>Save changes</button>
                            </div>
                            <div className="level-item">
                                <button className="button" onClick={closeAddPopup}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    } else
        return <div></div>
}