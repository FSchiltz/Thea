import React from "react";
import { formatDuration } from "../../helpers/Format";
import Tea from "../../model/Tea";
import TeaCardMenu from "./TeaCardMenu";

interface TeaCardProps {
    tea: Tea;
    handleEnableTea: (id: string)=> void;
    handleDisableTea: (id: string) => void;
    handleDeleteClick: (id: string)=> void;
    handleFavoriteTea: (id: Tea)=> void;
    handleClick: (id: string) => void;
    openEditPopup: (id: string) => void;
}

export default function TeaCard({ tea, handleEnableTea, handleDisableTea, handleDeleteClick, handleFavoriteTea, handleClick, openEditPopup }: TeaCardProps) {
    if (!tea.id)
        return <div></div>;

    const id = tea.id;

    let style = 'card card-small card-justify m-1';

    if (tea.isDisabled) {
        // disabled card are light grey and no click
        style += ' has-text-grey-light';
    }

    return <div className={style} key={id}>
        <div className='card-content px-3 py-2'>
            <div className="level m-0">
                <p className='mb-1 is-size-4 ellipsis no-wrap'>{tea.name}</p>
                <TeaCardMenu tea={tea} openEditPopup={e => openEditPopup(id)} enableTea={() => handleEnableTea(id)}
                    disableTea={() => handleDisableTea(id)}
                    deleteTea={() => handleDeleteClick(id)} favoriteTea={() => handleFavoriteTea(tea)} />
            </div>
            <div className='level is-mobile has-text-grey mb-2'>
                <div className='level-left'>
                    <div className="level-item">
                        <button className="button py-1 px-2 is-primary is-inverted" disabled={tea.isDisabled} onClick={tea.isDisabled ? () => { } : () => handleClick(id)}>
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#play" />
                            </svg>
                        </button>
                    </div>
                    <div className='level-item'>
                        <div className='box icon-text p-1'>
                            <span className="icon">
                                <svg className="feather" width="16" height="16">
                                    <use href="/feather-sprite.svg#thermometer" />
                                </svg>
                            </span>
                            <span>{tea.temperature} °C</span>
                        </div>
                    </div>
                    <div className='level-item'>
                        <div className='box icon-text p-1'>
                            <span className="icon">
                                <svg className="feather" width="16" height="16">
                                    <use href="/feather-sprite.svg#clock" />
                                </svg>
                            </span>
                            <span>{formatDuration(tea.duration)}</span>
                        </div>
                    </div>
                    <div className='level-item'>
                        {tea.isFavorite ? <svg className="feather is-filled has-text-danger" width="20" height="20">
                            <use href="/feather-sprite.svg#heart" />
                        </svg> : null}
                    </div>
                </div>
            </div>

            <div className='content ellipsis'>{tea.description}</div>
        </div>
    </div>;
}
