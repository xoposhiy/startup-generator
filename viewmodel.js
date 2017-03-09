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

function postProcess(parts){
	if (parts.what.endsWith('!')){ // женский род
		if (parts.which !== undefined)
			parts.which = parts.which.replace(/(ый|ий) /g, 'ая ').replace(/(ый|ий)$/g, 'ая');
		parts.what = parts.what.replace('!', '');
	}
	let res = [parts.which, parts.what, parts.forWhom, parts.withWhat].filter(i => i !== undefined);
	let phrase = res.join(' ');
	for(let p of ['c', 'для', 'в', 'со', 'по'])
		phrase = phrase.replace(p + ' ', p + '&nbsp;');
	return phrase.capitalizeFirstLetter();
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
	idea: '',
	ideasCount: 0
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
			yaCounter43313614.reachGoal("clickIdea", {idea: this.idea, count: this.ideasCount});
		},
		generate: function(event){
			this.idea = generate(this.ideasCount);
			this.ideasCount++;
		}
	}
});