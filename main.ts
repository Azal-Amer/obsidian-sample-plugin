import { Plugin } from 'obsidian'
import { SurveySettingTab } from "./SettingTab";
import { randomTimeRange } from "./startupTasks";
import { PopulateJsonFireStore } from "/Users/amer_/Desktop/Plugin Development Environment/Plugin Development/.obsidian/plugins/Survey Plugin/firebaseSetup/firebase";

interface PluginSettings {
	timeRange: string;
	callCount:string;
	templateDir: string;
	activeDay: Array<number>;
	times: Array<{hour:number,minute:number}>;
	mainDir: string;
}
export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	timeRange:"8:00-17:00",
	callCount: "2",
	templateDir: "templates",
	mainDir: "surveys",
}
export default class ExamplePlugin extends Plugin {
	statusBarTextElement: HTMLElement;
	settings: PluginSettings;
	populateFireStore = new PopulateJsonFireStore();
	initTimes() {
		//we need to check if we've already randomized the time for the date, if we haven't, we need to do so
		let today = new Date();
		let date = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
		// first check if we've defined the active day
		let dayCondition =
			JSON.stringify(this.settings.activeDay) == JSON.stringify(date);
		if (this.settings.activeDay == undefined) {
			this.settings.activeDay = date;
			this.settings.times = randomTimeRange(
				this.settings.timeRange,
				parseInt(this.settings.callCount)
			);
			this.saveSettings();
		}
		// check if the indecies in active day are the same as the date
		else if (!dayCondition) {
			console.log("we have not seen this day before");
			console.log(this.settings.activeDay);
			console.log(date);
			console.log(dayCondition);
			this.settings.activeDay = date;
			this.settings.times = randomTimeRange(
				this.settings.timeRange,
				parseInt(this.settings.callCount)
			);
			console.log(this.settings.times);
			this.saveSettings();
		} else if (
			parseInt(this.settings.callCount) != this.settings.times.length
		) {
			this.settings.times = randomTimeRange(
				this.settings.timeRange,
				parseInt(this.settings.callCount)
			);
			this.saveSettings();
		} else {
			console.log("we have seen this day before");
			console.log(this.settings.times);
		}
	}
	surveyDirectoryConstructor(directory: string, date: Date) {
		console.log("here");
		let [day, month, year] = [
			date.getDate(),
			date.getMonth(),
			date.getFullYear(),
		];
		// We want to check if there is a directory for the year, and if not make one
		let months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		let yearDirectory = `${directory}/${year}`;
		let monthDirectory = `${yearDirectory}/${months[month]}`;
		let dayDirectory = `${monthDirectory}/${day}`;
		let directories = [yearDirectory, monthDirectory, dayDirectory];
		for (let i = 0; i < directories.length; i++) {
			this.app.vault.adapter.exists(directories[i]).then((exists) => {
				console.log("here2");
				this.app.vault.adapter.mkdir(directories[i]);
			});
		}
		return dayDirectory;
		// go through all the directories in the folder, if they don't exist, make them
	}
	async onload() {
		// access the data.json file that stores the settings

		// we need to save the active day

		await this.loadSettings();

		this.populateFireStore.populate();

		this.addSettingTab(new SurveySettingTab(this.app, this));

		// get the local obsidian directory
		const obsidianDir = this.app.vault.getRoot().path;
		let surveyDir = obsidianDir + "/" + "surveys";
		console.log(this.surveyDirectoryConstructor(surveyDir, new Date()));
		this.initTimes();
	}
	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
		this.populateFireStore.populate();
		// when we hit the save settings button, this will wait until the data is ready to be saved
	}
	// In typescript, as in the type, we now have types. When we're working, it's easier to define variables as the
	// objects we can manipulate for readability and manipulation. if we're defining a type, define corresponding to
	// definition's output
}