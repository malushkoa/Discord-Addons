module.exports = (_ => {
	const changeLog = {
		"improved": {
			"Alias Order": "Automatically sets a higher priority for longer aliases, to avoid short aliases from overwritting longer ones"
}
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
getName () {return this.name;}
		getAuthor () {return this.author;}
getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;}

		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
	onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;	
this.downloadLibrary();
}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
let template = document.createElement("template");
template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
} : (([Plugin, BDFDB]) => {
		var aliases = {};

		return class ChatAliases extends Plugin {
onLoad () {
				this.defaults = {
configs: {
						case: 				{value: false,		description: "Handles the Word Value case sensitive"},
exact: 				{value: true,		description: "Handles the Word Value as an exact Word and not as part of a Word"},
regex: 				{value: false,		description: "Handles the Word Value as a RegExp String"}
					},
general: {
						addContextMenu:		{value: true, 		inner: false,		description: "Adds a Context Menu Entry to more freely add new Aliases"}
					},
places: {
						normal:				{value: true, 		inner: true,		description: "Normal Message Textarea"},
	edit:				{value: true, 		inner: true,		description: "Edit Message Textarea"}
					}
				};
		
				this.modulePatches = {
					before: [
						"ChannelTextAreaContainer"		
	]
				};
			}

			onStart () {
				aliases = BDFDB.DataUtils.load(this, "words");
BDFDB.PatchUtils.forceAllUpdates(this);
			}
onStop () {
				BDFDB.PatchUtils.forceAllUpdates(this);
			}

			getSettingsPanel (collapseStates = {}) {
				let settingsPanel;
return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
					collapseStates: collapseStates,
children: _ => {
						let settingsItems = [];

						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
title: "Settings",
collapseStates: collapseStates,
							children: Object.keys(this.defaults.general).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
type: "Switch",
								plugin: this,
keys: ["general", key],
								label: this.defaults.general[key].description,
value: this.settings.general[key]
})).concat(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {
	title: "Automatically replace Aliases in:",
children: Object.keys(this.settings.places).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
									type: "Switch",
plugin: this,
									keys: ["places", key],
label: this.defaults.places[key].description,
	value: this.settings.places[key]
								}))
							}))
}));
						
						let values = {wordValue: "", replaceValue: ""};
settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
							title: "Add new Alias",
collapseStates: collapseStates,
							children: [
								BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {
	type: "Button",
									label: "Pick a Word Value and Replacement Value:",
disabled: !Object.keys(values).every(valueName => values[valueName]),
									children: BDFDB.LanguageUtils.LanguageStrings.ADD,
ref: instance => {if (instance) values.addButton = instance;},
									onClick: _ => {
										this.saveWord(values);
										BDFDB.PluginUtils.refreshSettingsPanel(this, settingsPanel, collapseStates);
}
								}),
								this.createInputs(values)
							].flat(10).filter(n => n)
						}));

						if (!BDFDB.ObjectUtils.isEmpty(aliases)) settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
							title: "Added Aliases",
collapseStates: collapseStates,
							children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsList, {
settings: Object.keys(this.defaults.configs),
								data: Object.keys(aliases).map((wordValue, i) => Object.assign({}, aliases[wordValue], {
	label: wordValue
								})),
								renderLabel: data => BDFDB.ReactUtils.createElement("div", {
style: {width: "100%"},
									children: [
										BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextInput, {
value: data.label,
											placeholder: data.label,
size: BDFDB.LibraryComponents.TextInput.Sizes.MINI,
											maxLength: 100000000000000000000,
onChange: value => {
												aliases[value] = aliases[data.label];
delete aliases[data.label];
												data.label = value;
