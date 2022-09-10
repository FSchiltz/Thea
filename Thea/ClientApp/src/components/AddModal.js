import { AddForm } from "./AddForm";

const AddModal = ({ edit, add, newTea, formChanged, closeAddPopup, saveNewTea }) => {
    if (edit || add) {
        const active = "is-active";

        const title = edit ? "Edit" : "Add";

        return <div className={`modal ${active}`}>
            <div className="modal-background"></div>
            <div className='modal-content'>
                <div className="content box">
                    <span className="is-size-3">{title}</span>
                    <div className="p-4">
                        <AddForm onChange={formChanged} name={newTea.name} description={newTea.description}
                            temperature={newTea.temperature} durationMinutes={newTea.durationMinutes}
                            durationSeconds={newTea.durationSeconds} id={newTea.id}></AddForm>
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
    }
}

export default AddModal;