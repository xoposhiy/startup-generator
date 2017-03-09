  var config = {
    apiKey: "AIzaSyA6g5MHqNWhIHLypfrxIInXcXGch9w2Odg",
    authDomain: "startup-generator.firebaseapp.com",
    databaseURL: "https://startup-generator.firebaseio.com",
    storageBucket: "startup-generator.appspot.com",
    messagingSenderId: "416728947602"
  };

  let firebaseInitialized = false;

const listSize = 10;

function initializeFirebase(vm){
	if (firebaseInitialized) return Promise.resolve(true);
	firebase.initializeApp(config);
	firebaseInitialized = true;
	return new Promise((resolve, reject) => {
		firebase.auth().onAuthStateChanged(function(user) 
		{
			if (user) {
				subscribeLastIdeas(vm);
				resolve(true)
			} else {
				firebase.auth().signInAnonymously().catch(reject);
			}
		});
	});
}

Object.values = object => Object.keys(object).map(k => object[k]);

function subscribeLastIdeas(vm){
	let ideasRef = firebase.database().ref('ideas');
	ideasRef.orderByChild('lastLikeTime').limitToLast(listSize).on('value', function(snap){
		let val = snap.val();
		if (val == null) vm.lastIdeas = [];
		vm.lastIdeas = Object.values(val).sort((a, b) => b.lastLikeTime - a.lastLikeTime);
	});
	ideasRef.orderByChild('likes').limitToLast(listSize).on('value', function(snap){
		let val = snap.val();
		if (val == null) vm.bestIdeas = [];
		vm.bestIdeas = Object.values(val).sort((a, b) => b.likes - a.likes);
	});
}

function saveLikeToFirebase(ideaObj){
	let user = firebase.auth().currentUser;
	if (user == null) return;
	let ideaRef = firebase.database().ref('ideas').orderByChild('fullText').equalTo(ideaObj.fullText);
	ideaRef.once('value', function(snap){
		if (snap.val() == null){
			ideaRef = firebase.database().ref('ideas').push();
			var record = Object.assign({}, ideaObj)
			record.likes = 1;
			record.lastLikeTime = firebase.database.ServerValue.TIMESTAMP;
			record.likers = [firebase.auth().currentUser.uid];
			ideaRef.set(record).catch(function(error){console.log(error);});
		}
		else {
			let recordId = Object.keys(snap.val())[0];
			let d = snap.val()[recordId];
			let uid = firebase.auth().currentUser.uid;
			if (d.likers.indexOf(uid) >= 0) return;
			d.likers.push(uid);
			d.likes++;
			d.lastLikeTime = firebase.database.ServerValue.TIMESTAMP;
			firebase.database().ref('ideas/' + recordId)
				.set(d).catch(function(error){console.log(error);});
		}
	}).catch(function(error){console.log(error);});

}