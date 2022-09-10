import { AddForm } from "./AddForm";

const AddModal = ({ edit, add, newTea, formChanged, closeAddPopup, saveNewTea }) => {
    if (edit || add) {
        const active = "is-active";

        return <div className={`modal ${active}`}>
            <div className="modal-background"></div>
            <div className='modal-content'>
                <div className='modal-card'>
                    <header className="modal-card-head">
                        <p className="modal-card-title">Add</p>
                    </header>
                </div>
                <section className="modal-card-body">
                    <AddForm onChange={formChanged} name={newTea.name} description={newTea.description}
                        temperature={newTea.temperature} durationMinutes={newTea.durationMinutes}
                        durationSeconds={newTea.durationSeconds} id={newTea.id}></AddForm>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={saveNewTea}>Save changes</button>
                    <button className="button" onClick={closeAddPopup}>Cancel</button>
                </footer>
            </div>
        </div>
    }
}

export default AddModal;