import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyCG5BJZZBFgcQWGBqRJhDaNz8ewexFRYkc",
  authDomain: "fir-sample-95184.firebaseapp.com",
  databaseURL: "https://fir-sample-95184.firebaseio.com",
  projectId: "fir-sample-95184",
  storageBucket: "fir-sample-95184.appspot.com",
  messagingSenderId: "848826544523",
  appId: "1:848826544523:web:5a70d96c03d2a91e093f8e"
};

firebase.initializeApp(firebaseConfig);

export default firebase
