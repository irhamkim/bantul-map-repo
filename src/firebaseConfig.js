import firebase from 'firebase'

let config = {
	apiKey: "AIzaSyCON3UrdVYl7UhIdzzeqgwZOLmF8MwfEzk",
    authDomain: "bantul-cmap.firebaseapp.com",
    databaseURL: "https://bantul-cmap.firebaseio.com",
    projectId: "bantul-cmap",
}

firebase.initializeApp(config)
export default firebase