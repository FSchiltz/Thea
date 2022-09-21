import React, { Component } from 'react';
import { NavBar } from './NavBar';
import { askNotifyPermission } from '../helpers/Notify';
import { getTeas, getTea, updateTea } from '../api/TeaApi';
import { TeasTable } from './Teas/TeasTable';
import AddModal from './Teas/AddModal';
import Tea  from '../model/Tea';

interface HomeState {
	newTea: Tea;
	filter: string;
	teas: Tea[];
	allTeas: Tea[];
	loading: boolean;
	edit: boolean;
	add: boolean;
	notify: boolean;
	showDisable: boolean;
	error?: any;
}

interface HomeProps {

}

export default class Home extends Component<HomeProps, HomeState> {
	readonly notifyStorageKey = "Thea.Notify";
	readonly disableStorageKey = "Thea.Disable";

	constructor(props: HomeProps | Readonly<HomeProps>) {
		super(props);

		// TODO move to an helper class
		var notify = (localStorage.getItem(this.notifyStorageKey) === 'true');

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
			newTea: new Tea()
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

	onFilterChanged(filter: string) {
		this.setState({ filter: filter }, this.filter);
	}

	onNotifyChanged(notify: boolean) {
		localStorage.setItem(this.notifyStorageKey, String(notify));
		if (notify)
			askNotifyPermission()
		this.setState({ notify: notify });
	}

	onDisableChanged(disable: boolean) {
		localStorage.setItem(this.disableStorageKey, String(disable));
		this.setState({ showDisable: disable }, this.dataChanged);
	}

	openSavePopup() {
		const newTea = this.state.newTea;
		newTea.id = undefined;
		this.setState({ add: true, edit: false, newTea: newTea });
	}

	async openEditPopup(id: string) {
		const newTea = await getTea(id);

		this.setState({ add: false, edit: true, newTea: newTea });
	}

	closeAddPopup() {
		this.setState({ edit: false, add: false });
	}

	formChanged(event: Tea) {
		this.setState({ newTea: event });
	}

	async saveNewTea() {
		console.log("New tea saved");

		await updateTea(this.state.newTea);
		this.closeAddPopup();
		await this.populateteasData();
	}

	displayError(e: unknown) {
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
			contents = <div>Error</div>
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
			allTeas = allTeas.filter(tea => tea.name?.toLocaleLowerCase().includes(filter) === true);
		}

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
