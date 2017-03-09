function generate(i){
	let generators = [
		concat({which, what, forWhom}),
		concat({what, forWhom, withWhat}),
	];
	let parts = postProcess(generators[i%generators.length]());
	return parts;
}

String.prototype.capitalizeFirstLetter = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

function makeFemale(phrase){
	return phrase.replace(/(ый|ий) /g, 'ая ').replace(/(ый|ий)$/g, 'ая');
}

function postProcess(parts){
	// женский род
	if (parts.what.endsWith('!')){
		parts.female = true;
		parts.what = parts.what.replace('!', '');
		if (parts.which !== undefined)
			parts.which = makeFemale(parts.which);
	}
	if (parts.which !== undefined) parts.which = parts.which.capitalizeFirstLetter();
	else parts.what = parts.what.capitalizeFirstLetter();
	parts.fullText = [parts.which, parts.what, parts.withWhat, parts.forWhom].join(' ');
	return parts;
}

function concat(parts){
	return function(){
		var res = {};
		for(let name in parts)
			res[name] = selectFrom(parts[name]);
		return res;
	}
}

function selectFrom(array){
	let next = array.shift();
	array.push(next)
	return next;
}


var data = {
	ideasCount: 1,
	idea: generate(1),
	lastIdeas: null,
	bestIdeas: null,
	lastIdeasFeedShown: true,
	bestIdeasFeedShown: false
};

var vm = new Vue({
	el: "#root",
	data: data,
	computed: {
		isFeedShown: function() {
			return this.lastIdeas !== null && this.lastIdeasFeedShown
				|| this.bestIdeas !== null && this.bestIdeasFeedShown;
		},
		feed: function() {
			return this.lastIdeasFeedShown ? this.lastIdeas
			     : this.bestIdeasFeedShown ? this.bestIdeas : [];
		}
	},
	methods: {
		clickIdea: function(event){
			yaCounter43328569.reachGoal("clickIdea", {idea: this.idea, count: this.ideasCount});
		},
		changeWhich: function(event){
			this.idea.which = selectFrom(which);
			this.idea = postProcess(this.idea);
			this.ideasCount++;
		},
		changeWhat: function(event){
			this.idea.what = selectFrom(what);
			this.idea = postProcess(this.idea);
			this.ideasCount++;
		},
		changeForWhom: function(event){
			this.idea.forWhom = selectFrom(forWhom);
			this.idea = postProcess(this.idea);
			this.ideasCount++;
		},
		changeWithWhat: function(event){
			this.idea.withWhat = selectFrom(withWhat);
			this.idea = postProcess(this.idea);
			this.ideasCount++;
		},
		markIdeaAsGood: function (event) {
			initializeFirebase(this)
				.then(_ => saveLikeToFirebase(this.idea))
				.then(_ => {
					this.idea = generate(this.ideasCount++)
				});
		},
		markIdeaAsBad: function (event) {
			this.idea = generate(this.ideasCount++);
		},
		addLikeToIdea: function(idea) {
			initializeFirebase(this)
				.then(_ => saveLikeToFirebase(idea))
		},
		showLastIdeasFeed: function() {
			this.lastIdeasFeedShown = true;
			this.bestIdeasFeedShown = false;
		},
		showBestIdeasFeed: function() {
			this.bestIdeasFeedShown = true;
			this.lastIdeasFeedShown = false;
		}
	}
});
