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
