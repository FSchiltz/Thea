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

		// TODO move to an helper class
		this.notifyStorageKey = "Thea.Notify";
		var notify = (localStorage.getItem(this.notifyStorageKey) === 'true');

		this.disableStorageKey = "Thea.Disable";
		var disable = (localStorage.getItem(this.disableStorageKey) === 'true');

		this.state = {
			teas: [],
			allTeas: [],
			filter: '',
			loading: true,
			edit: false,
			add: false,
			notify: notify,
			showDisable: disable,
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
		this.onFilterChanged = this.onFilterChanged.bind(this);
		this.onDisableChanged = this.onDisableChanged.bind(this);
	}

	componentDidMount() {
		this.populateteasData();
	}

	dataChanged() {
		this.populateteasData();
	}

	onFilterChanged(e) {
		this.setState({ filter: e }, this.filter);
	}

	onNotifyChanged(notify) {
		localStorage.setItem(this.notifyStorageKey, notify);
		if (notify)
			askNotifyPermission()
		this.setState({ notify: notify });
	}

	onDisableChanged(disable) {
		localStorage.setItem(this.disableStorageKey, disable);
		this.setState({ showDisable: disable }, this.dataChanged);
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
				<NavBar onAddClick={this.openSavePopup}
					notify={this.state.notify} onNotifyChanged={this.onNotifyChanged}
					disable={this.state.showDisable} onDisableChanged={this.onDisableChanged}
					onFilterChanged={this.onFilterChanged} filter={this.state.filter}></NavBar>
				{contents}
			</div>
		);
	}

	filter() {
		let filter = this.state.filter;
		let allTeas = this.state.allTeas;
		if (filter) {
			filter = filter.toLocaleLowerCase();
			allTeas = allTeas.filter((tea) => tea.name.toLocaleLowerCase().includes(filter));
		}

		console.log("filtered :" + filter);
		this.setState({ teas: allTeas });
	}

	async populateteasData() {
		try {
			const data = await getTeas(this.state.showDisable);
			this.setState({ allTeas: data, loading: false }, this.filter);
		} catch (e) {
			this.displayError(e);
		}
	}
}
