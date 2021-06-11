import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBx2WAg4wKd_871t7-uY9hWv5O2fqf33gQ",
    authDomain: "whatsapp-clone-e77a2.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-e77a2.firebaseio.com",
    projectId: "whatsapp-clone-e77a2",
    storageBucket: "whatsapp-clone-e77a2.appspot.com",
    messagingSenderId: "536303331433",
    appId: "1:536303331433:web:e9171f3bf55ffe230fdaf8",
    measurementId: "G-9HCFK095VL"
  };

  firebase.initializeApp(firebaseConfig);

  var provider = new firebase.auth.GoogleAuthProvider();

  export default firebase;
  export {provider};