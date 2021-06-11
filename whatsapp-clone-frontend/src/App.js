import React from 'react';
import { useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import firebase, { provider } from './firebase'
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';

function App() {

  const [state, setState] = useState({
    photoURL: "",
    displayName: "",
    uid: "",
    access: false
  });

  const onLogin = () => {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        setState(() => {return {
          photoURL: user.photoURL, 
          displayName: user.displayName,
          uid: user.uid,
          access: true
        }});
        console.log(result);
      }).catch(err => {
        console.log(err);
      })
  }

  return state.access ? (
    <Router>
    <div className="app">
      <div className="app__body">
        <Sidebar detail={state} />
          <Switch>
            <Route path="/chat/:id" component={(props) => <Chat {...props} detail={state} key={window.location.pathname}/>}/>
          </Switch>
      </div>
    </div>
      </Router>
  ) : (
    <div className="app">
    <div className="sign__in">
    <img src="https://e7.pngegg.com/pngimages/1006/83/png-clipart-whatsapp-computer-icons-android-whatsapp-cdr-logo.png" alt="logo"/>
    <button onClick={onLogin} type="button">Sign in with Google</button>
    </div>
  </div>
   
  );
}

export default App;
