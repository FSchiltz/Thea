import React, { ChangeEvent, Component, MouseEventHandler } from 'react';
import { deconstructDuration, getDuration } from '../../helpers/Time';
import Tea from '../../model/Tea';

class AddFormState {
    constructor(tea: Tea) {
        this.id = tea.id;
        this.name = tea.name ?? '';
        this.description = tea.description ?? '';
        this.temperature = tea.temperature ?? '';
        this.color = tea.color ?? '';
        this.level = tea.level ?? '';

        const [durationMinutes, durationSeconds] = deconstructDuration(tea.duration);
        this.durationSeconds = durationSeconds;
        this.durationMinutes = durationMinutes;
    }

    id?: string;
    duration?: string;
    temperature: number = 0;
    name?: string;
    color?: string;
    description?: string;
    durationMinutes: number = 0;
    durationSeconds: number = 0;
    level: number = 0;
}

interface AddFormProps {
    tea: Tea;
    onChange: (name: Tea) => void;
}

export default class AddForm extends Component<AddFormProps, AddFormState> {
    constructor(props: AddFormProps | Readonly<AddFormProps>) {
        super(props);

        this.state = new AddFormState(this.props.tea);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
        this.handleMinutesChange = this.handleMinutesChange.bind(this);
        this.handleSecondsChange = this.handleSecondsChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleLevelChange = this.handleLevelChange.bind(this);
        this.handleColorDelete = this.handleColorDelete.bind(this);
    }

    handleColorDelete(event: React.MouseEvent<HTMLDivElement>) {
        this.setState({ color: undefined}, () => this.changed());
    }

    handleLevelChange(event: ChangeEvent<HTMLSelectElement>) {
        this.setState({ level: parseInt(event.target.value) }, () => this.changed());
    }

    handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ description: event.target.value }, () => this.changed());
    }

    handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({ name: event.target.value }, () => this.changed());
    }

    handleColorChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({ color: event.target.value }, () => this.changed());
    }

    handleTemperatureChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({ temperature: event.target.valueAsNumber }, () => this.changed());
    }

    handleMinutesChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({ durationMinutes: event.target.valueAsNumber }, () => this.changed());
    }

    handleSecondsChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({ durationSeconds: event.target.valueAsNumber }, () => this.changed());
    }

    changed() {
        if (this.props.onChange) {
            const tea = new Tea();
            tea.id = this.state.id;
            tea.description = this.state.description;
            tea.duration = getDuration(this.state.durationMinutes, this.state.durationSeconds);
            tea.name = this.state.name;
            tea.temperature = this.state.temperature;
            tea.color = this.state.color;
            tea.level = this.state.level;

            this.props.onChange(tea);
        }
    }

    render() {
        return (
            <form>
                <div className="field">
                    <label className='label' >Name</label>
                    <input className='input' type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                </div>

                <div className="field">
                    <label className='label'>Description</label>
                    <textarea className='textarea' name="description" placeholder="Description" value={this.state.description} onChange={this.handleDescriptionChange} />
                </div>

                <div className='field'>
                    <label className="label">Duration</label>
                    <div className="field has-addons">
                        <div className="control">
                            <div className="button is-static">
                                <span className="icon is-small is-left">
                                    <svg className="feather">
                                        <use href="/feather-sprite.svg#clock" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="control">
                            <input className='input' type="number" name="durationMinutes" placeholder="2" value={this.state.durationMinutes} onChange={this.handleMinutesChange} />

                        </div>
                        <div className="control">
                            <input className='input' type="number" name="durationSeconds" placeholder="0" value={this.state.durationSeconds} onChange={this.handleSecondsChange} />
                        </div>
                    </div>
                </div>

                <div className='field'>
                    <label className='label' >Temperature</label>
                    <div className="field has-addons">
                        <div className="control">
                            <div className="button is-static">
                                <span className="icon is-small is-left">
                                    <svg className="feather">
                                        <use href="/feather-sprite.svg#thermometer" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <p className="control">
                            <input className='input' type="number" name="temperature" placeholder="90 °C" value={this.state.temperature} onChange={this.handleTemperatureChange} />
                        </p>
                    </div>
                </div>
                <div className='field'>
                    <label className='label'>Tea level</label>
                    <div className="control has-icons-left">
                        <div className="select">
                            <select defaultValue='0' onChange={this.handleLevelChange}>
                                <option value='0'>Unkown</option>
                                <option value='1'>No tea</option>
                                <option value='2'>Low</option>
                                <option value='3'>Medium</option>
                                <option value='4'>Heavy</option>
                            </select>
                        </div>
                        <span className="icon p-2  is-left">
                            <svg className="feather">
                                <use href="/feather-sprite.svg#coffee" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div className='field'>
                    <label className='label' >Background color</label>
                    <div className="field has-addons">
                        <div className="control">
                            <div className="button is-static">
                                <span className="icon is-small is-left">
                                    <svg className="feather">
                                        <use href="/feather-sprite.svg#image" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <p className="control">
                            <input className='input' style={{ width: '50px' }} type="color" name="color" value={this.state.color} onChange={this.handleColorChange} />
                        </p>
                        <div className="control">
                            <div className="button is-danger is-light" onClick={this.handleColorDelete}>
                                <span className="icon is-small is-right">
                                    <svg className="feather">
                                        <use href="/feather-sprite.svg#x" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}