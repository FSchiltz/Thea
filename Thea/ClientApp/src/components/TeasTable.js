import { Component } from "react";
import { getTea } from "../api/TeaApi";
import { setTimer, stopTimer } from "../api/TimerApi";
import { deconstructDuration, formatDuration } from "../helpers/Format";
import { askNotifyPermission } from "../helpers/Notify";
import TimerModal from "./TimerModal";


export class TeasTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // This binding is necessary to make `this` work in the callback 
        this.handleClick = this.handleClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleClick(e) {
        askNotifyPermission();
        this.selectTea(e);
    }

    handleDeleteClick(e, id) {
        e.preventDefault();

        this.deleteTea(id);
    }

    async selectTea(teaId) {
        const data = await getTea(teaId);

        const [minutes, seconds] = deconstructDuration(data.duration);

        const duration = new Date();
        duration.setSeconds((minutes * 60) + seconds + duration.getSeconds());

        console.log('Timer started');

        const timerId = await setTimer(teaId);
        console.log('Server timer started');

        this.setState({ duration: duration, tea: data, timerOn: true, timerId: timerId });
    }

    async closeTimer() {
        console.log('Timer stopped');

        const timerId = this.state.timerId;

        if (timerId) {
            await stopTimer(timerId);
            console.log('Server timer stopped');
        }

        this.setState({ duration: null, tea: null, timerOn: false, timerId: null });
    }

    render() {
        let images;
        let noImages;
        if (this.props.teas.length > 0) {
            images = this.props.teas.map(tea =>
            (
                <div className='card m-1' key={tea.id} >
                    <div className='card-content is-clickable' onClick={() => this.handleClick(tea.id)}>
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
                        <div className="card-footer-item has-text-primary is-clickable" onClick={(e) => this.props.openEditPopup(e, tea.id)}>
                            <svg className="feather">
                                <use href="/feather-sprite.svg#edit" />
                            </svg>
                        </div>
                        <div className="card-footer-item has-text-danger is-clickable" onClick={(e) => this.handleDeleteClick(e, tea.id)}>
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
                <TimerModal duration={this.state.duration} notifyDone={this.notifyDone} closePopup={this.closePopup} tea={this.state.tea} timerOn={this.state.timerOn} />
            </div>
        );
    }
}