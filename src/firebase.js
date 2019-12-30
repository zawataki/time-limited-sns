import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyCHftesHfgg_vO29DkbpUbLOZYn4q9JpKM",
  authDomain: "mayfly-86915.firebaseapp.com",
  databaseURL: "https://mayfly-86915.firebaseio.com",
  projectId: "mayfly-86915",
  storageBucket: "mayfly-86915.appspot.com",
  messagingSenderId: "490409158667",
  appId: "1:490409158667:web:bf0ec8a4625217dc61ff0e",
  measurementId: "G-G211MXL861"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase
