import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC___velexMFtDzS19C7BXXBUT1ChBSRTs",
    authDomain: "toptalproject-50eeb.firebaseapp.com",
    databaseURL: "https://toptalproject-50eeb.firebaseio.com",
    projectId: "toptalproject-50eeb",
    storageBucket: "toptalproject-50eeb.appspot.com",
    messagingSenderId: "978013149913"
  };
  firebase.initializeApp(config);

  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth()
  export default firebase;