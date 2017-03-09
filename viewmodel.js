function generate(i){
	let generators = [
		concat({which, what, forWhom}),
		concat({what, forWhom, withWhat}),
	];
	var parts = generators[i%generators.length]();
	return postProcess(parts);
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
	return parts;
}

function concat(parts){
	return function(){
		console.log(parts);
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
	idea: generate(1)
};





var vm = new Vue({
	el: "#root",
	data: data,
	computed: {
		button_name: function() {
			return this.ideasCount == 0 ? 'Срочно, нужна идея!' : 'Нужна ещё идея!';
		},
		mailto: function(){
			return "mailto:Шифман&cc=Устюжанин&subject=Идея проекта: " + this.idea;
		}
	},
	methods: {
		clickIdea: function(event){
			yaCounter43328569.reachGoal("clickIdea", {idea: this.idea, count: this.ideasCount});
		},
		changeWhich: function(event){
			let whichPart = selectFrom(which);
			if (this.idea.female) whichPart = makeFemale(whichPart);
			this.idea.which = whichPart;
			this.ideasCount++;
		},
		changeWhat: function(event){
			this.idea.what = selectFrom(what);
			postProcess(this.idea);
			this.ideasCount++;
		},
		changeForWhom: function(event){
			this.idea.forWhom = selectFrom(forWhom);
			this.ideasCount++;
		},
		changeWithWhat: function(event){
			this.idea.withWhat = selectFrom(withWhat);
			this.ideasCount++;
		},
		markIdeaAsGood: function (event) {
			// Put the idea to the global feed
			// TODO

			// Generate new idea
			this.idea = generate(this.ideasCount);
			this.ideasCount++;
		},
		markIdeaAsBad: function (event) {
			// Generate new idea
			this.idea = generate(this.ideasCount);
			this.ideasCount++;
		}
	}
});
