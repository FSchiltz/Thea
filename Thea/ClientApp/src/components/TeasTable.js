import { formatDuration } from "../helpers/Format";

const TeasTable = ({ teas, handleClick, openEditPopup, handleDeleteClick }) => {
    let images;
    let noImages;
    if (teas.length > 0) {
        images = teas.map(tea =>
        (
            <div className='card m-1' key={tea.id} >
                <div className='card-content is-clickable' onClick={() => handleClick(tea.id)}>
                    <p className='title'>{tea.name}</p>
                    <div className='level is-mobile'>
                        <div className='level-left'>
                            <div className='level-item'>
                                <div className='box icon-text'>
                                    <span className="icon">
                                        <svg className="feather">
                                            <use href="/feather-sprite.svg#thermometer" />
                                        </svg>
                                    </span>
                                    <span>{tea.temperature} °C</span>
                                </div>
                            </div>
                            <div className='level-item'>
                                <div className='box icon-text'>
                                    <span className="icon">
                                        <svg className="feather">
                                            <use href="/feather-sprite.svg#clock" />
                                        </svg>
                                    </span>
                                    <span>{formatDuration(tea.duration)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='content'>{tea.description}</div>
                </div>
                <footer className="card-footer">
                    <div className="card-footer-item has-text-primary is-clickable" onClick={(e) => openEditPopup(e, tea.id)}>
                        <svg className="feather">
                            <use href="/feather-sprite.svg#edit" />
                        </svg>
                    </div>
                    <div className="card-footer-item has-text-danger is-clickable" onClick={(e) => handleDeleteClick(e, tea.id)}>
                        <span className="icon">
                            <svg className="feather">
                                <use href="/feather-sprite.svg#trash" />
                            </svg>
                        </span>
                    </div>
                </footer>
            </div>
        ));
    } else {
        noImages = <div className='block is-size-1 is-align-self-flex-end' key="1">No teas</div>;
    }

    return (
        <div className='is-flex is-flex-direction-row is-flex-wrap-wrap'>
            {images}

            {noImages}
        </div>
    );
}

export default TeasTable;