import React, { Component } from 'react';
import { NavBar } from './NavBar';
import { createDuration, deconstructDuration } from '../helpers/Format';
import { askNotifyPermission } from '../helpers/Notify';
import { getTeas, getTea, updateTea } from '../api/TeaApi';
import { TeasTable } from './TeasTable';
import AddModal from './AddModal';

export class Home extends Component {
	constructor(props) {
		super(props);

		this.notifyStorageKey = "Thea.Notify";
		var notify = (localStorage.getItem(this.notifyStorageKey) === 'true');

		this.state = {
			teas: [],
			loading: true,
			edit: false,
			add: false,
			notify: notify,
			newTea: {}
		};

		// This binding is necessary to make `this` work in the callback 
		this.openSavePopup = this.openSavePopup.bind(this);
		this.openEditPopup = this.openEditPopup.bind(this);
		this.closeAddPopup = this.closeAddPopup.bind(this);
		this.saveNewTea = this.saveNewTea.bind(this);
		this.formChanged = this.formChanged.bind(this);
		this.onNotifyChanged = this.onNotifyChanged.bind(this);
		this.dataChanged = this.dataChanged.bind(this);
	}

	componentDidMount() {
		this.populateteasData();
	}

	dataChanged() {
		this.populateteasData();
	}

	onNotifyChanged(notify) {
		localStorage.setItem(this.notifyStorageKey, notify);
		if (notify)
			askNotifyPermission()
		this.setState({ notify: notify });
	}

	openSavePopup() {
		const newTea = this.state.newTea;
		newTea.id = null;
		this.setState({ add: true, edit: false, newTea: newTea });
	}

	async openEditPopup(e, id) {
		e.preventDefault();

		const newTea = await getTea(id);

		const [minutes, seconds] = deconstructDuration(newTea.duration);
		newTea.durationMinutes = minutes;
		newTea.durationSeconds = seconds;
		newTea.duration = null;

		this.setState({ add: false, edit: true, newTea: newTea });
	}

	closeAddPopup() {
		this.setState({ edit: false, add: false });
	}

	formChanged(event) {
		this.setState({ newTea: event });
	}

	async saveNewTea() {
		console.log("New tea saved");

		let minutes = this.state.newTea.durationMinutes;
		if (!minutes)
			minutes = 0;

		let seconds = this.state.newTea.durationSeconds;
		if (!seconds)
			seconds = 0;

		let temperature = parseInt(this.state.newTea.temperature);
		if (!temperature)
			temperature = 0;

		const tea = {
			name: this.state.newTea.name,
			description: this.state.newTea.description,
			temperature: temperature,
			duration: createDuration(minutes, seconds),
		};

		if (this.state.newTea.id)
			tea.id = this.state.newTea.id;

		await updateTea(tea);
		this.closeAddPopup();
		await this.populateteasData();
	}

	displayError(e) {
		this.setState({ error: e })
	}

	render() {
		let contents;

		if (this.state.loading)
			contents = <p><em>Loading...</em></p>
		else {
			contents =
				<div>
					<AddModal add={this.state.add} closeAddPopup={this.closeAddPopup} edit={this.state.edit} formChanged={this.formChanged}
						newTea={this.state.newTea} saveNewTea={this.saveNewTea} />
					<TeasTable teas={this.state.teas} openEditPopup={this.openEditPopup} notify={this.state.notify}
						dataChanged={this.dataChanged} />
				</div>;
		}

		if (this.state.error) {
			contents += <div>Error</div>
		}

		return (
			<div>
				<NavBar onAddClick={this.openSavePopup} notify={this.state.notify} onNotifyChanged={this.onNotifyChanged}></NavBar>
				{contents}
			</div>
		);
	}

	async populateteasData() {
		try {
			const data = await getTeas();
			this.setState({ teas: data, loading: false });
		} catch (e) {
			this.displayError(e);
		}
	}
}
