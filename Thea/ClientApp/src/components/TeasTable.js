import { Component } from "react";
import { deleteTea, disableTea, enableTea, getTea } from "../api/TeaApi";
import { setTimer, stopTimer } from "../api/TimerApi";
import { deconstructDuration, formatDuration } from "../helpers/Format";
import { askNotifyPermission } from "../helpers/Notify";
import Confirm from "./Confirm";
import TimerModal from "./TimerModal";

export class TeasTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: null,
            tea: null,
            timerOn: false,
            timerId: null,
            delete: null,
        };

        // This binding is necessary to make `this` work in the callback 
        this.handleClick = this.handleClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.notifyDone = this.notifyDone.bind(this);
        this.openEditPopup = this.props.openEditPopup.bind(this);
        this.deleteTea = this.deleteTea.bind(this);
        this.enableTea = this.enableTea.bind(this);
        this.disableTea = this.disableTea.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick(e) {
        // if the user wants notification we ask before the timer is done
        if (this.props.notify)
            askNotifyPermission();
        this.selectTea(e);
    }

    handleClose() {
        this.setState({ delete: null });
    }

    handleDeleteClick(e, id) {
        e.preventDefault();

        this.setState({ delete: id })
    }

    closePopup() {
        this.closeTimer();
    }

    notifyDone() {
        if (this.props.notify) {
            // if so, create a notification
            new Notification("Tea ready !");
        }
    }

    async disableTea() {
        await disableTea(this.state.delete);

        console.log('Tea disabled');

        this.setState({ delete: null });

        await this.props.dataChanged();
    }

    async enableTea() {
        await enableTea(this.state.delete);

        console.log('Tea disabled');

        this.setState({ delete: null });

        await this.props.dataChanged();
    }

    async deleteTea() {
        await deleteTea(this.state.delete);

        console.log('Tea deleted');

        this.setState({ delete: null });

        await this.props.dataChanged();
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
            images = this.props.teas.map(tea => {
                let style = 'card m-1';
                let click = () => { };
                let edit = (e) => this.props.openEditPopup(e, tea.id);
                let editIcon = '/feather-sprite.svg#edit';

                if (tea.isDisabled) {
                    // disabled card are light grey and no click
                    style += ' has-text-grey-light';
                    click = () => this.handleClick(tea.id);

                    // disabled can't be edited but enabled
                    edit = async (e) => {
                        await enableTea(tea.id);
                        this.props.dataChanged();
                    };
                    editIcon = '/feather-sprite.svg#skip-forward'
                }

                return (
                    <div className={style} key={tea.id} >
                        <div className='card-content is-clickable p-4' onClick={click}>
                            <p className='mb-1 is-size-4'>{tea.name}</p>
                            <div className='level is-mobile has-text-grey mb-3'>
                                <div className='level-left'>
                                    <div className='level-item'>
                                        <div className='box icon-text p-2'>
                                            <span className="icon">
                                                <svg className="feather" width="25" height="25">
                                                    <use href="/feather-sprite.svg#thermometer" />
                                                </svg>
                                            </span>
                                            <span>{tea.temperature} °C</span>
                                        </div>
                                    </div>
                                    <div className='level-item'>
                                        <div className='box icon-text p-2'>
                                            <span className="icon">
                                                <svg className="feather" width="25" height="25">
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
                            <div className="card-footer-item has-text-primary is-clickable" onClick={edit}>
                                <svg className="feather" width="20" height="20">
                                    <use href={editIcon} />
                                </svg>
                            </div>
                            <div className="card-footer-item has-text-danger is-clickable" onClick={(e) => this.handleDeleteClick(e, tea.id)}>
                                <span className="icon">
                                    <svg className="feather" width="20" height="20">
                                        <use href="/feather-sprite.svg#trash" />
                                    </svg>
                                </span>
                            </div>
                        </footer>
                    </div>
                )
            });
        } else {
            noImages = <div className='block is-size-1 is-align-self-flex-end' key="1">No teas</div>;
        }

        return (
            <div className='is-flex is-flex-direction-row is-flex-wrap-wrap'>
                {images}

                {noImages}
                <Confirm handleSubmit={this.deleteTea} handleDisable={this.disableTea} handleClose={this.handleClose} text="Are you sure you ?" isOpen={this.state.delete} />
                <TimerModal duration={this.state.duration} notifyDone={this.notifyDone} closePopup={this.closePopup} tea={this.state.tea} timerOn={this.state.timerOn} />
            </div>
        );
    }
}
