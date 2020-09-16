import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA_aZAYRf1V1OwNx_wntEo9IjOv_Ok6NJQ",
    authDomain: "aleef-4b784.firebaseapp.com",
    databaseURL: "https://aleef-4b784.firebaseio.com",
    projectId: "aleef-4b784",
    storageBucket: "aleef-4b784.appspot.com",
    messagingSenderId: "219848826808",
    appId: "1:219848826808:web:5ed6a1a68374ed5c01f94d"
};

firebase.initializeApp(firebaseConfig);

export default firebase;