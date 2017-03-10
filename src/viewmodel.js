import {which, what, withWhat, forWhom} from './generator';
import {initializeFirebase, saveLikeToFirebase} from './db';
import Vue from 'vue';

String.prototype.capitalizeFirstLetter = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

let generate = function(i){
	let generators = [
		concat({whichRaw:which, whatRaw:what, forWhom, withWhat}),
		// concat({which, what, forWhom}),
		// concat({what, forWhom, withWhat}),
	];
	let parts = postProcess(generators[i%generators.length]());
	return parts;
}

let makeFemale = function(phrase){
	return phrase.replace(/(ый|ий) /g, 'ая ').replace(/(ый|ий)$/g, 'ая');
}

let postProcess = function(parts){
	// женский род
	parts.what = parts.whatRaw.replace('!', '');
	parts.which = parts.whichRaw;
	let female = parts.whatRaw.endsWith('!');
	if (female)
		parts.which = makeFemale(parts.whichRaw);
	parts.which = parts.which.capitalizeFirstLetter();
	parts.fullText = [parts.which, parts.what, parts.withWhat, parts.forWhom].join(' ');
	return parts;
}

let concat = function(parts){
	return function(){
		var res = {};
		for(let name in parts)
			res[name] = selectFrom(parts[name]);
		return res;
	}
}

let selectFrom = function(array){
	let next = array.shift();
	array.push(next)
	return next;
}


let data = {
	ideasCount: 1,
	userId: null,
	idea: generate(1),
	lastIdeas: null,
	bestIdeas: null,
	lastIdeasFeedShown: true,
	bestIdeasFeedShown: false
};

export let vm = new Vue({
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
		changeWhich: function(event){
			this.idea.whichRaw = selectFrom(which);
			this.idea = postProcess(this.idea);
			this.ideasCount++;
		},
		changeWhat: function(event){
			this.idea.whatRaw = selectFrom(what);
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
					this.idea = generate(this.ideasCount++);
					this.showLastIdeasFeed();
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
